# Quick Start Guide

Get started with markdown-driven agent development in just a few minutes!

## 🚀 5-Minute Setup

### Step 1: Install VS Code Extensions

1. Open VS Code
2. Press `Cmd+Shift+X` (Extensions)
3. Install:
   - GitHub Copilot
   - GitHub Copilot Chat

### Step 2: Sign in to GitHub Copilot

1. Press `Cmd+Shift+P` (Command Palette)
2. Type "GitHub Copilot: Sign In"
3. Follow the authentication flow

### Step 3: Try Your First Agent

1. Open this workspace in VS Code
2. The [.github-instructions.md](.github-instructions.md) file defines agent behavior
3. Press `Cmd+Shift+I` to open Copilot Chat
4. Try these commands:
   ```
   Explain what this starter kit does
   
   How do I set up an Azure DevOps MCP server?
   
   Show me how to create a custom agent
   ```

## 📖 What to Read First

Start with these documents in order:

1. **[README.md](README.md)** - Overview and reading list on AI agents, MCP, and agent skills
2. **[TUTORIAL.md](TUTORIAL.md)** - Complete step-by-step tutorial covering:
   - Environment setup
   - Understanding `.github-instructions.md`
   - Creating your first agent
   - Adding MCP servers
   - Advanced topics

3. **Examples**:
   - [.github-instructions.md](.github-instructions.md) - Example agent configuration
   - [examples/simple-agent.md](examples/simple-agent.md) - Basic agent template
   - [contexts/azure-devops.md](contexts/azure-devops.md) - Azure DevOps context example
   - [contexts/azure-portal.md](contexts/azure-portal.md) - Azure Portal context example

## 🔧 Configure MCP Servers (Optional)

To enable MCP server connections:

### Quick Setup

1. Copy the example settings:
   ```bash
   cp .vscode/settings.json.example .vscode/settings.json
   ```

2. Edit `.vscode/settings.json` and uncomment the servers you want to use

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

### Azure DevOps MCP Server

```bash
# Install dependencies
cd examples/azure-devops-mcp
npm install

# Set environment variables
export AZURE_DEVOPS_ORG="your-org"
export AZURE_DEVOPS_PAT="your-pat"
```

See [examples/azure-devops-mcp/README.md](examples/azure-devops-mcp/README.md) for detailed instructions.

### Azure Portal MCP Server

```bash
# Install dependencies
cd examples/azure-portal-mcp
npm install

# Login to Azure
az login

# Set environment variables
export AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
export AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)
```

See [examples/azure-portal-mcp/README.md](examples/azure-portal-mcp/README.md) for detailed instructions.

## 🎯 Common Use Cases

### Use Case 1: Check Azure DevOps Build Status

**Setup**: Configure Azure DevOps MCP server (see above)

**Usage**:
```
@azure-devops show me recent builds for MyProject
```

### Use Case 2: Query Azure Resources

**Setup**: Configure Azure Portal MCP server (see above)

**Usage**:
```
@azure-portal list all app services in production resource group
```

### Use Case 3: Custom Agent for Your Project

1. Edit [.github-instructions.md](.github-instructions.md)
2. Add your project-specific information
3. Create context files in `contexts/` directory
4. Test with Copilot Chat

## 🚀 Next Steps

Once you're comfortable with the basics:

1. **Customize Your Agent**:
   - Edit `.github-instructions.md` for your project
   - Add domain-specific context in `contexts/`
   - Define custom workflows

2. **Add More MCP Servers**:
   - Explore [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
   - Configure additional servers in VS Code settings

3. **Build Custom MCP Server**:
   - See [advanced/MCP_SERVER_GUIDE.md](advanced/MCP_SERVER_GUIDE.md)
   - Try the [Python example](advanced/python-mcp-example/)
   - Try the [C# example](advanced/csharp-mcp-example/)

## 📚 Learning Path

### Beginner (0-2 hours)
- ✅ Read README.md reading list
- ✅ Complete TUTORIAL.md sections 1-3
- ✅ Create your first custom agent
- ✅ Test in Copilot Chat

### Intermediate (2-4 hours)
- ✅ Configure Azure DevOps MCP server
- ✅ Configure Azure Portal MCP server
- ✅ Create custom context files
- ✅ Build complex workflows

### Advanced (4+ hours)
- ✅ Read MCP_SERVER_GUIDE.md
- ✅ Build custom Python MCP server
- ✅ Build custom C# MCP server
- ✅ Deploy and share your server

## 🆘 Getting Help

### Documentation
- [README.md](README.md) - Overview and concepts
- [TUTORIAL.md](TUTORIAL.md) - Detailed instructions
- [MCP_SERVER_GUIDE.md](advanced/MCP_SERVER_GUIDE.md) - Building custom servers

### External Resources
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [VS Code Copilot Docs](https://code.visualstudio.com/docs/copilot/overview)

### Troubleshooting
- Check [TUTORIAL.md](TUTORIAL.md) troubleshooting sections
- Review MCP server logs in VS Code Output panel
- Verify environment variables are set correctly

## ✅ Checklist

Before you start development:

- [ ] VS Code installed with Copilot extensions
- [ ] GitHub Copilot authenticated
- [ ] Read README.md reading list
- [ ] Reviewed .github-instructions.md example
- [ ] Tried basic Copilot Chat commands
- [ ] (Optional) MCP servers configured
- [ ] (Optional) Environment variables set

## 🎉 You're Ready!

You now have everything needed to build markdown-driven agents. Start with simple queries in Copilot Chat and gradually build more complex agents as you learn.

**Happy building!** 🚀

---

**Need help?** Open an issue or check the documentation links above.
