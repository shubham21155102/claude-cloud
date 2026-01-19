#!/bin/bash

# Claude Cloud Installation Script

set -e

echo "🤖 Claude Cloud Installation Script"
echo "===================================="
echo ""

# Check Node.js installation
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Check npm installation
echo "📦 Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo ""

# Check Claude CLI installation
echo "🤖 Checking Claude CLI installation..."
if ! command -v claude &> /dev/null; then
    echo "⚠️  Claude CLI is not installed!"
    echo ""
    echo "To use Claude Cloud, you need to install Claude CLI from z.ai:"
    echo "Visit: https://docs.z.ai/devpack/tool/claude"
    echo ""
    echo "You can continue with the installation, but Claude CLI is required to use this tool."
    echo ""
else
    echo "✅ Claude CLI found"
fi

# Make CLI executable
echo "🔧 Setting up CLI..."
chmod +x cli.js

# Optionally link globally
echo ""
read -p "Do you want to install claude-cloud globally? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm link
    echo "✅ claude-cloud installed globally"
    echo "You can now run: claude-cloud"
else
    echo "ℹ️  You can run the tool using: node cli.js"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Run setup: claude-cloud setup (or node cli.js setup)"
echo "2. Start contributing: claude-cloud contribute"
echo ""
echo "For more information, see README.md"
