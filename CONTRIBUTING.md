# Contributing to Claude Cloud

Thank you for your interest in contributing to Claude Cloud! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the Issues section
2. If not, create a new issue with a clear title and description
3. Include steps to reproduce (for bugs)
4. Include your environment details (OS, Node version, etc.)

### Submitting Changes

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/claude-cloud.git
   cd claude-cloud
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clear, concise commit messages
   - Follow the existing code style
   - Test your changes thoroughly

4. **Test Your Changes**
   ```bash
   npm install
   node cli.js --version
   # Test the commands
   node cli.js setup
   node cli.js config
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature" # or "fix: fix bug"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes

## Development Guidelines

### Code Style

- Use 2 spaces for indentation
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase

### Commit Messages

Follow the conventional commits specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add support for private repositories
fix: resolve issue with git configuration
docs: update installation instructions
```

### Adding New Features

When adding new features:

1. Discuss the feature in an issue first
2. Keep changes focused and minimal
3. Update documentation (README.md)
4. Add examples if applicable
5. Test on multiple platforms if possible

### Testing

Before submitting a PR:

1. Test the installation process
2. Test all CLI commands
3. Verify error handling
4. Test on your target platform (Linux/Mac/Windows)

## Project Structure

```
claude-cloud/
├── cli.js              # Main CLI application
├── package.json        # Dependencies and scripts
├── README.md          # Main documentation
├── EXAMPLES.md        # Usage examples
├── CONTRIBUTING.md    # This file
├── install.sh         # Unix installation script
├── install.bat        # Windows installation script
├── .gitignore         # Git ignore rules
└── .github/
    └── workflows/     # GitHub Actions
```

## Questions?

If you have questions:

1. Check the README.md and EXAMPLES.md
2. Search existing issues
3. Create a new issue with the "question" label

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!
