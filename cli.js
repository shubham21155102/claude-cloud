#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const chalk = require('chalk');

const program = new Command();

// Configuration file path
const CONFIG_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.claude-cloud-config.json');

program
  .name('claude-cloud')
  .description('Automated tool to contribute to any GitHub repository using Claude AI')
  .version('1.0.0');

program
  .command('setup')
  .description('Setup your GitHub credentials and preferences')
  .action(async () => {
    console.log(chalk.blue('🔧 Setting up Claude Cloud...'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubUsername',
        message: 'Enter your GitHub username:',
        validate: (input) => input.length > 0 || 'GitHub username is required'
      },
      {
        type: 'input',
        name: 'githubEmail',
        message: 'Enter your GitHub email:',
        validate: (input) => input.includes('@') || 'Valid email is required'
      },
      {
        type: 'input',
        name: 'workDir',
        message: 'Enter working directory for cloning repos:',
        default: path.join(process.cwd(), 'temp_repos')
      }
    ]);
    
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(answers, null, 2));
    console.log(chalk.green('✅ Configuration saved successfully!'));
    console.log(chalk.gray(`Configuration file: ${CONFIG_FILE}`));
  });

program
  .command('contribute')
  .description('Contribute to a GitHub repository using Claude AI')
  .option('-o, --org <org>', 'Organization or username')
  .option('-r, --repo <repo>', 'Repository name')
  .option('-i, --issue <issue>', 'Issue description')
  .action(async (options) => {
    try {
      // Load configuration
      if (!fs.existsSync(CONFIG_FILE)) {
        console.log(chalk.red('❌ Configuration not found. Please run "claude-cloud setup" first.'));
        process.exit(1);
      }
      
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      
      // Prompt for missing options
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'org',
          message: 'Enter the GitHub organization or username:',
          when: !options.org,
          validate: (input) => input.length > 0 || 'Organization/username is required'
        },
        {
          type: 'input',
          name: 'repo',
          message: 'Enter the repository name:',
          when: !options.repo,
          validate: (input) => input.length > 0 || 'Repository name is required'
        },
        {
          type: 'editor',
          name: 'issue',
          message: 'Describe the issue/task (will open your default editor):',
          when: !options.issue,
          validate: (input) => input.length > 0 || 'Issue description is required'
        }
      ]);
      
      const org = options.org || answers.org;
      const repo = options.repo || answers.repo;
      const issue = options.issue || answers.issue;
      
      console.log(chalk.blue(`\n🚀 Starting contribution to ${org}/${repo}...`));
      
      // Create working directory
      const workDir = config.workDir || path.join(process.cwd(), 'temp_repos');
      if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir, { recursive: true });
      }
      
      const repoPath = path.join(workDir, `${org}_${repo}`);
      
      // Clone or update repository
      console.log(chalk.blue('📥 Cloning/updating repository...'));
      if (fs.existsSync(repoPath)) {
        console.log(chalk.yellow('Repository already exists, pulling latest changes...'));
        try {
          execSync('git pull', { cwd: repoPath, stdio: 'inherit' });
        } catch (error) {
          console.log(chalk.yellow('Pull failed, continuing anyway...'));
        }
      } else {
        const repoUrl = `https://github.com/${org}/${repo}.git`;
        console.log(chalk.gray(`Cloning from ${repoUrl}...`));
        execSync(`git clone ${repoUrl} ${repoPath}`, { stdio: 'inherit' });
      }
      
      // Configure git user
      console.log(chalk.blue('⚙️  Configuring git user...'));
      execSync(`git config user.name "${config.githubUsername}"`, { cwd: repoPath });
      execSync(`git config user.email "${config.githubEmail}"`, { cwd: repoPath });
      
      // Create a prompt file for Claude
      const promptFile = path.join(repoPath, '.claude-task.md');
      fs.writeFileSync(promptFile, issue);
      
      console.log(chalk.blue('\n🤖 Running Claude AI...'));
      console.log(chalk.gray('This will execute: claude --dangerously-skip-permissions'));
      console.log(chalk.yellow('⚠️  Make sure Claude CLI is installed (z.ai devpack)'));
      
      // Prepare the Claude command
      const claudePrompt = `You are working on the repository ${org}/${repo}.

${issue}

Please:
1. Analyze the issue/task described above
2. Make the necessary code changes
3. Create a pull request with these changes
4. The PR should be created under the name: ${config.githubUsername}

Work carefully and make minimal, focused changes to address the issue.`;
      
      console.log(chalk.cyan('\n📝 Task description:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(issue);
      console.log(chalk.gray('─'.repeat(50)));
      
      // Execute Claude with the prompt
      console.log(chalk.blue('\n🎯 Launching Claude...'));
      
      // Write prompt to a temporary file
      const tempPromptFile = path.join(repoPath, '.claude-prompt-temp.txt');
      fs.writeFileSync(tempPromptFile, claudePrompt);
      
      // Launch Claude in interactive mode
      const claudeProcess = spawn('claude', [
        '--dangerously-skip-permissions',
        '--message', claudePrompt
      ], {
        cwd: repoPath,
        stdio: 'inherit',
        shell: true
      });
      
      claudeProcess.on('error', (error) => {
        console.log(chalk.red('\n❌ Error running Claude CLI:'));
        console.log(chalk.red(error.message));
        console.log(chalk.yellow('\n💡 Make sure Claude CLI is installed:'));
        console.log(chalk.gray('   Visit: https://docs.z.ai/devpack/tool/claude'));
        console.log(chalk.gray('   Or install via: npm install -g @z.ai/claude'));
      });
      
      claudeProcess.on('close', (code) => {
        // Cleanup temp files
        if (fs.existsSync(tempPromptFile)) {
          fs.unlinkSync(tempPromptFile);
        }
        if (fs.existsSync(promptFile)) {
          fs.unlinkSync(promptFile);
        }
        
        if (code === 0) {
          console.log(chalk.green('\n✅ Claude completed successfully!'));
          console.log(chalk.blue(`📁 Repository location: ${repoPath}`));
        } else {
          console.log(chalk.yellow(`\n⚠️  Claude exited with code ${code}`));
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
      console.log(chalk.yellow('No configuration found. Run "claude-cloud setup" first.'));
      return;
    }
    
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    console.log(chalk.blue('\n📋 Current Configuration:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.cyan('GitHub Username:'), config.githubUsername);
    console.log(chalk.cyan('GitHub Email:'), config.githubEmail);
    console.log(chalk.cyan('Working Directory:'), config.workDir);
    console.log(chalk.gray('─'.repeat(50)));
  });

program.parse();
