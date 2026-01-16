# MCP Server Installation Guide

This guide walks you through installing dependencies for all MCP servers in this starter kit.

## Prerequisites

- **Node.js** 18+ (for Azure DevOps and Azure Portal MCP servers)
- **Python** 3.10+ (for Python MCP server example)
- **.NET** 8.0+ (for C# MCP server example)

Check your installations:
```bash
node --version
python3 --version
dotnet --version
```

## Install All Dependencies

Run this script to install all dependencies at once:

```bash
# From the starterkit root directory
./install-dependencies.sh
```

Or follow the individual installation steps below.

## Individual Installation

### Azure DevOps MCP Server

```bash
cd examples/azure-devops-mcp
npm install
```

**Dependencies installed:**
- `@modelcontextprotocol/sdk` - MCP SDK for Node.js

### Azure Portal MCP Server

```bash
cd examples/azure-portal-mcp
npm install
```

**Dependencies installed:**
- `@modelcontextprotocol/sdk` - MCP SDK for Node.js

### Python MCP Server Example

```bash
cd advanced/python-mcp-example

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Dependencies installed:**
- `mcp` - MCP SDK for Python
- `asyncpg` - PostgreSQL async driver

### C# MCP Server Example

```bash
cd advanced/csharp-mcp-example

# Restore dependencies
dotnet restore

# Build project
dotnet build
```

**Dependencies installed:**
- Various .NET packages for configuration, DI, and logging

## Verification

Test that everything is installed correctly:

### Test Node.js MCP Servers

```bash
# Test Azure DevOps server
cd examples/azure-devops-mcp
node server.js --version

# Test Azure Portal server
cd examples/azure-portal-mcp
node server.js --version
```

### Test Python MCP Server

```bash
cd advanced/python-mcp-example
source venv/bin/activate
python server.py --help
```

### Test C# MCP Server

```bash
cd advanced/csharp-mcp-example
dotnet run --help
```

## Common Issues

### Issue: Node.js version too old
**Solution**: Update Node.js to version 18 or higher
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### Issue: Python not found or version too old
**Solution**: Install Python 3.10+
```bash
# macOS with Homebrew
brew install python@3.11

# Windows: Download from https://www.python.org/
```

### Issue: .NET SDK not found
**Solution**: Install .NET 8.0 SDK
```bash
# macOS with Homebrew
brew install --cask dotnet-sdk

# Or download from https://dotnet.microsoft.com/
```

### Issue: npm install fails
**Solution**: Clear npm cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Python pip install fails
**Solution**: Upgrade pip and retry
```bash
python3 -m pip install --upgrade pip
pip install -r requirements.txt
```

## Next Steps

After installation:

1. **Configure environment variables** (see `.env.example`)
2. **Update VS Code settings** (see `.vscode/settings.json.example`)
3. **Test MCP servers** in Copilot Chat
4. **Review the TUTORIAL** for detailed usage instructions

## Keeping Dependencies Updated

Periodically update dependencies:

```bash
# Node.js packages
npm update

# Python packages
pip install --upgrade -r requirements.txt

# .NET packages
dotnet restore --force
```

---

For more detailed information, see:
- [TUTORIAL.md](TUTORIAL.md) - Complete setup guide
- [MCP_SERVER_GUIDE.md](advanced/MCP_SERVER_GUIDE.md) - Building custom servers
