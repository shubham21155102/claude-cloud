# 🤖 Claude Cloud

Automated tool to contribute to any GitHub repository using Claude AI. Simply provide the repository name and organization, describe the issue, and let Claude AI do the work!

## ✨ Features

- 🎯 **Simple Interface**: Just provide org name, repo name, and issue description
- 🤖 **AI-Powered**: Uses Claude AI to analyze and fix issues
- 🔄 **Automated PR Creation**: Automatically creates pull requests with your name
- 🚀 **Universal**: Works with any GitHub repository
- ⚙️ **Configurable**: Set up once, use everywhere

## 📋 Prerequisites

Before using Claude Cloud, you need to install:

1. **Node.js** (v14 or higher)
2. **Claude CLI** from z.ai devpack

### Installing Claude CLI

Follow the installation instructions at: [https://docs.z.ai/devpack/tool/claude](https://docs.z.ai/devpack/tool/claude)

Or install via npm (if available):
```bash
npm install -g @z.ai/claude
```

## 🚀 Installation

1. Clone this repository:
```bash
git clone https://github.com/shubham21155102/claude-cloud.git
cd claude-cloud
```

2. Install dependencies:
```bash
npm install
```

3. Make the CLI executable globally (optional):
```bash
npm link
```

Or use it directly:
```bash
node cli.js
```

## ⚙️ Setup

Before first use, configure your GitHub credentials:

```bash
claude-cloud setup
```

Or if not linked globally:
```bash
node cli.js setup
```

You'll be prompted for:
- GitHub username
- GitHub email
- Working directory (where repos will be cloned)

This creates a configuration file at `~/.claude-cloud-config.json`

## 📖 Usage

### Basic Usage

Contribute to any repository with an interactive prompt:

```bash
claude-cloud contribute
```

You'll be prompted to enter:
1. Organization or username
2. Repository name
3. Issue description (opens in your default editor)

### Using Command-Line Options

You can also provide all information via command-line options:

```bash
claude-cloud contribute -o <org> -r <repo> -i "Issue description"
```

Example:
```bash
claude-cloud contribute -o microsoft -r vscode -i "Fix the tab spacing issue in settings"
```

### View Configuration

Check your current configuration:

```bash
claude-cloud config
```

## 🎯 How It Works

1. **Setup**: Configure your GitHub credentials once
2. **Specify Target**: Provide the repository org and name
3. **Describe Issue**: Write what needs to be done
4. **Auto-Clone**: The tool clones/updates the repository
5. **AI Processing**: Claude AI analyzes the issue with `--dangerously-skip-permissions` flag
6. **PR Creation**: A pull request is automatically created with your name

## 🔧 Command Reference

### `setup`
Configure GitHub credentials and preferences
```bash
claude-cloud setup
```

### `contribute`
Start contributing to a repository
```bash
claude-cloud contribute [options]
```

Options:
- `-o, --org <org>`: Organization or username
- `-r, --repo <repo>`: Repository name
- `-i, --issue <issue>`: Issue description

### `config`
Display current configuration
```bash
claude-cloud config
```

## 📝 Example Workflow

```bash
# 1. First time setup
claude-cloud setup

# 2. Contribute to a repository
claude-cloud contribute

# When prompted:
# - Enter org: "facebook"
# - Enter repo: "react"
# - Describe issue: "Add TypeScript support to the new component"

# 3. Claude AI will:
#    - Clone the repository
#    - Analyze the issue
#    - Make necessary changes
#    - Create a PR with your name
```

## 🔐 Security Note

This tool uses the `--dangerously-skip-permissions` flag with Claude CLI, which allows Claude to execute commands without prompting. Use this tool only with repositories you trust and understand the implications of automated code changes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📄 License

MIT

## 🔗 Resources

- [Claude AI Documentation](https://docs.z.ai/devpack/tool/claude)
- [GitHub API](https://docs.github.com/en/rest)

## ⚠️ Troubleshooting

### Claude CLI not found
Make sure Claude CLI is installed and available in your PATH:
```bash
which claude  # On Unix-like systems
where claude  # On Windows
```

### Permission Issues
Ensure you have:
- Git configured with proper credentials
- Access rights to the target repository
- GitHub authentication set up (SSH keys or HTTPS token)

### Repository Clone Failures
- Check your internet connection
- Verify the repository exists and is accessible
- Ensure you have read access to the repository

## 💡 Tips

1. **Detailed Descriptions**: The more detailed your issue description, the better Claude can help
2. **Working Directory**: Set a dedicated working directory to keep cloned repos organized
3. **Git Authentication**: Configure SSH keys or credential helper for seamless GitHub access
4. **Review Changes**: Always review the changes Claude makes before merging PRs