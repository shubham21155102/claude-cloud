@echo off
REM Claude Cloud Installation Script for Windows

echo 🤖 Claude Cloud Installation Script
echo ====================================
echo.

REM Check Node.js installation
echo 📦 Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
echo.

REM Check npm installation
echo 📦 Checking npm installation...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% found
echo.

REM Install dependencies
echo 📥 Installing dependencies...
call npm install
echo.

REM Check Claude CLI installation
echo 🤖 Checking Claude CLI installation...
where claude >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Claude CLI is not installed!
    echo.
    echo To use Claude Cloud, you need to install Claude CLI from z.ai:
    echo Visit: https://docs.z.ai/devpack/tool/claude
    echo.
    echo You can continue with the installation, but Claude CLI is required to use this tool.
    echo.
) else (
    echo ✅ Claude CLI found
)

REM Optionally link globally
echo.
set /p INSTALL_GLOBAL="Do you want to install claude-cloud globally? (y/n): "
if /i "%INSTALL_GLOBAL%"=="y" (
    call npm link
    echo ✅ claude-cloud installed globally
    echo You can now run: claude-cloud
) else (
    echo ℹ️  You can run the tool using: node cli.js
)

echo.
echo ✅ Installation complete!
echo.
echo Next steps:
echo 1. Run setup: claude-cloud setup (or node cli.js setup)
echo 2. Start contributing: claude-cloud contribute
echo.
echo For more information, see README.md

pause
