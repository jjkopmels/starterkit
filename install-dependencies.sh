#!/bin/bash

# Installation script for all MCP servers in the starter kit
# Run from the starterkit root directory

set -e  # Exit on error

echo "=================================="
echo "MCP Server Installation Script"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} found"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} ${PYTHON_VERSION} found"
else
    echo -e "${YELLOW}⚠${NC} Python3 not found. Python MCP example will be skipped."
fi

# Check .NET
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    echo -e "${GREEN}✓${NC} .NET ${DOTNET_VERSION} found"
else
    echo -e "${YELLOW}⚠${NC} .NET SDK not found. C# MCP example will be skipped."
fi

echo ""
echo "=================================="
echo "Installing Node.js MCP Servers"
echo "=================================="
echo ""

# Install Azure DevOps MCP Server
echo "Installing Azure DevOps MCP Server..."
cd examples/azure-devops-mcp
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓${NC} Azure DevOps MCP Server installed"
else
    echo -e "${RED}✗${NC} package.json not found"
fi
cd ../..
echo ""

# Install Azure Portal MCP Server
echo "Installing Azure Portal MCP Server..."
cd examples/azure-portal-mcp
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓${NC} Azure Portal MCP Server installed"
else
    echo -e "${RED}✗${NC} package.json not found"
fi
cd ../..
echo ""

# Install Python MCP Server
if command -v python3 &> /dev/null; then
    echo "=================================="
    echo "Installing Python MCP Server"
    echo "=================================="
    echo ""
    
    cd advanced/python-mcp-example
    if [ -f "requirements.txt" ]; then
        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            echo "Creating Python virtual environment..."
            python3 -m venv venv
        fi
        
        # Activate and install
        echo "Installing Python dependencies..."
        source venv/bin/activate
        pip install --upgrade pip > /dev/null
        pip install -r requirements.txt
        deactivate
        echo -e "${GREEN}✓${NC} Python MCP Server installed"
    else
        echo -e "${RED}✗${NC} requirements.txt not found"
    fi
    cd ../..
    echo ""
fi

# Install C# MCP Server
if command -v dotnet &> /dev/null; then
    echo "=================================="
    echo "Installing C# MCP Server"
    echo "=================================="
    echo ""
    
    cd advanced/csharp-mcp-example
    if [ -f "CustomMcpServer.csproj" ]; then
        echo "Restoring .NET dependencies..."
        dotnet restore
        echo "Building C# MCP Server..."
        dotnet build --configuration Release
        echo -e "${GREEN}✓${NC} C# MCP Server installed"
    else
        echo -e "${RED}✗${NC} CustomMcpServer.csproj not found"
    fi
    cd ../..
    echo ""
fi

echo "=================================="
echo "Installation Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and fill in your credentials"
echo "2. Copy .vscode/settings.json.example to .vscode/settings.json"
echo "3. Configure your MCP servers in VS Code settings"
echo "4. See TUTORIAL.md for detailed usage instructions"
echo ""
echo -e "${GREEN}Happy agent building! 🚀${NC}"
