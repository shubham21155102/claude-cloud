#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');

const program = new Command();

// Configuration file path
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.figma-designer-config.json');

program
  .name('figma-designer')
  .description('CLI tool to automate Figma design tasks using Claude AI with MCP')
  .version('1.0.0');

program
  .command('setup')
  .description('Setup your Figma and Claude credentials')
  .action(async () => {
    console.log(chalk.blue('🎨 Setting up Figma Designer...'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'figmaApiToken',
        message: 'Enter your Figma API Token (from figma.com/dev):',
        validate: (input) => input.length > 0 || 'Figma API Token is required'
      },
      {
        type: 'input',
        name: 'zaiApiKey',
        message: 'Enter your Z.AI API Key:',
        mask: '*',
        validate: (input) => input.length > 0 || 'API Key is required'
      },
      {
        type: 'input',
        name: 'workDir',
        message: 'Enter working directory for design tasks:',
        default: path.join(process.cwd(), 'figma_tasks')
      }
    ]);

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(answers, null, 2));
    console.log(chalk.green('✅ Configuration saved successfully!'));

    // Setup Claude settings
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const claudeDir = path.join(homeDir, '.claude');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    const settings = {
      env: {
        ANTHROPIC_API_KEY: answers.zaiApiKey,
        ANTHROPIC_AUTH_TOKEN: answers.zaiApiKey,
        ANTHROPIC_BASE_URL: "https://api.z.ai/api/anthropic",
        API_TIMEOUT_MS: "3000000",
        CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
        FIGMA_API_TOKEN: answers.figmaApiToken
      },
      model: "opus"
    };

    const settingsFile = path.join(claudeDir, 'settings.json');
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    console.log(chalk.gray(`Created Claude configuration at ${settingsFile}`));

    // Setup MCP configuration
    const mcpConfig = {
      mcpServers: {
        figma: {
          type: "http",
          url: "https://mcp.figma.com/mcp",
          env: {
            FIGMA_API_TOKEN: answers.figmaApiToken
          }
        }
      }
    };

    const mcpFile = path.join(claudeDir, '.mcp.json');
    fs.writeFileSync(mcpFile, JSON.stringify(mcpConfig, null, 2));
    console.log(chalk.gray(`Created MCP configuration at ${mcpFile}`));

    console.log(chalk.green('✅ Figma MCP configured successfully!'));
    console.log(chalk.yellow('💡 You can now run: figma-designer create'));
  });

program
  .command('create')
  .description('Create a new Figma design task')
  .option('-f, --file <url>', 'Figma file URL')
  .option('-n, --node <id>', 'Specific Figma node ID (optional)')
  .option('-t, --task <description>', 'Design task description')
  .option('-T, --task-file <file>', 'Read task description from file')
  .action(async (options) => {
    try {
      // Load configuration
      if (!fs.existsSync(CONFIG_FILE)) {
        console.log(chalk.red('❌ Configuration not found. Please run "figma-designer setup" first.'));
        process.exit(1);
      }

      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));

      // Get task from various sources (priority: CLI arg > file > env > prompt)
      let task = options.task;
      if (options.taskFile) {
        task = fs.readFileSync(options.taskFile, 'utf-8');
      }
      if (!task && process.env.FIGMA_DESIGN_TASK) {
        task = process.env.FIGMA_DESIGN_TASK;
      }

      // Prompt for missing options
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'file',
          message: 'Enter the Figma file URL:',
          when: !options.file,
          validate: (input) => input.includes('figma.com') || 'Must be a valid Figma URL'
        },
        {
          type: 'input',
          name: 'node',
          message: 'Enter specific Figma node ID (optional, press Enter to skip):',
          when: !options.node
        },
        {
          type: 'editor',
          name: 'task',
          message: 'Describe the design task (will open your default editor):',
          when: !task,
          validate: (input) => input.length > 0 || 'Task description is required'
        }
      ]);

      const fileUrl = options.file || answers.file;
      const nodeId = options.node || answers.node;
      task = task || answers.task;

      console.log(chalk.blue(`\n🎨 Starting Figma design task...`));
      console.log(chalk.gray(`📁 File: ${fileUrl}`));
      if (nodeId) {
        console.log(chalk.gray(`🎯 Node ID: ${nodeId}`));
      }

      // Create working directory
      const workDir = config.workDir || path.join(process.cwd(), 'figma_tasks');
      if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir, { recursive: true });
      }

      const taskDir = path.join(workDir, `task_${Date.now()}`);
      fs.mkdirSync(taskDir);

      // Create prompt file for Claude
      const claudePrompt = `You are working with Figma to complete a design task.

Figma File URL: ${fileUrl}
${nodeId ? `Specific Node ID: ${nodeId}` : 'No specific node ID - work with the entire file or main frames'}

Design Task:
${task}

Please:
1. Open the Figma file using the MCP tools
2. Analyze the current design structure
3. Complete the requested design task
4. Save your changes and provide a summary of what was modified

Use the Figma MCP tools available to interact with the design file.
`;

      const promptFile = path.join(taskDir, 'design-task.md');
      fs.writeFileSync(promptFile, claudePrompt);

      console.log(chalk.cyan('\n📝 Design task:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(task);
      console.log(chalk.gray('─'.repeat(50)));

      console.log(chalk.blue('\n🤖 Running Claude AI with Figma MCP...'));
      console.log(chalk.gray('This will execute: claude --dangerously-skip-permissions'));

      // Prepare environment
      const env = {
        ...process.env,
        ANTHROPIC_API_KEY: config.zaiApiKey,
        FIGMA_API_TOKEN: config.figmaApiToken
      };

      // Check if logs should be shown
      const showLogs = process.env.FIGMA_DESIGNER_SHOW_LOGS === 'true';
      const logFile = path.join(taskDir, 'claude-logs.txt');

      // Launch Claude
      const claudeProcess = spawn('claude', [
        '--dangerously-skip-permissions',
        claudePrompt
      ], {
        cwd: taskDir,
        stdio: showLogs ? 'inherit' : ['ignore', 'pipe', 'pipe'],
        shell: process.platform === 'win32',
        env: env
      });

      // Create log stream
      const logStream = fs.createWriteStream(logFile);

      if (!showLogs) {
        claudeProcess.stdout.on('data', (data) => {
          logStream.write(data);
        });

        claudeProcess.stderr.on('data', (data) => {
          logStream.write(data);
        });
      }

      claudeProcess.on('error', (error) => {
        console.log(chalk.red('\n❌ Error running Claude CLI:'));
        console.log(chalk.red(error.message));
        console.log(chalk.yellow('\n💡 Make sure Claude Code is installed via npm:'));
        console.log(chalk.gray('   npm install -g @anthropic-ai/claude-code'));
        logStream.write(`Error: ${error.message}\n`);
      });

      claudeProcess.on('close', (code) => {
        // Cleanup prompt file
        if (fs.existsSync(promptFile)) {
          fs.unlinkSync(promptFile);
        }

        // Close log stream
        logStream.end();

        if (code === 0) {
          console.log(chalk.green('\n✅ Claude completed successfully!'));
          console.log(chalk.blue(`📁 Task location: ${taskDir}`));
          if (!showLogs) {
            console.log(chalk.gray(`📋 Logs saved to: ${logFile}`));
          }
        } else {
          console.log(chalk.yellow(`\n⚠️  Claude exited with code ${code}`));
          if (!showLogs) {
            console.log(chalk.gray(`📋 Check logs at: ${logFile}`));
          }
        }
      });

    } catch (error) {
      console.log(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    if (!fs.existsSync(CONFIG_FILE)) {
      console.log(chalk.yellow('No configuration found. Run "figma-designer setup" first.'));
      return;
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    console.log(chalk.blue('\n📋 Current Configuration:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.cyan('Figma API Token:'), config.figmaApiToken ? '********' : 'Not set');
    console.log(chalk.cyan('Z.AI API Key:'), config.zaiApiKey ? '********' : 'Not set');
    console.log(chalk.cyan('Working Directory:'), config.workDir);
    console.log(chalk.gray('─'.repeat(50)));
  });

program.parse();
