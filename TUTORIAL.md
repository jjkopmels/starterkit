# Markdown-Driven Agent Development Tutorial

This comprehensive tutorial will guide you through setting up a VS Code environment for developing markdown-driven AI agents that can interact with Azure services through MCP servers.

## Table of Contents

1. [Environment Setup](#1-environment-setup)
2. [Understanding .github-instructions.md](#2-understanding-github-instructionsmd)
3. [Creating Your First Markdown-Driven Agent](#3-creating-your-first-markdown-driven-agent)
4. [Adding MCP Server Connections](#4-adding-mcp-server-connections)
5. [Using Agents with MCP Servers](#5-using-agents-with-mcp-servers)
6. [Advanced: Building Custom MCP Servers](#6-advanced-building-custom-mcp-servers)

---

## 1. Environment Setup

### Prerequisites

Before starting, ensure you have:
- **VS Code** (version 1.85 or later)
- **GitHub Copilot** subscription (for agent functionality)
- **Node.js** (version 18 or later) - for MCP server development
- **Git** - for version control
- **Azure CLI** (optional) - for Azure service authentication

### Step 1.1: Install VS Code Extensions

1. Open VS Code
2. Navigate to Extensions (Cmd+Shift+X on macOS)
3. Install the following extensions:
   - **GitHub Copilot** (`github.copilot`)
   - **GitHub Copilot Chat** (`github.copilot-chat`)

### Step 1.2: Clone the Starter Kit

```bash
# Clone this repository
git clone <repository-url> markdown-agent-starterkit
cd markdown-agent-starterkit

# Open in VS Code
code .
```

### Step 1.3: Verify GitHub Copilot Setup

1. Open the Command Palette (Cmd+Shift+P)
2. Type "GitHub Copilot: Sign In"
3. Follow the authentication flow
4. Verify by opening Copilot Chat (Cmd+Shift+I or click the chat icon)

### Step 1.4: Configure VS Code Settings

Add these settings to your `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true
  },
  "github.copilot.advanced": {
    "debug.enableChatInEditor": true
  },
  "files.associations": {
    ".github-instructions.md": "markdown"
  }
}
```

### Step 1.5: Set Up Your Workspace

Create the following directory structure:

```
your-project/
├── .github-instructions.md      # Agent behavior definition
├── contexts/                    # Agent-specific contexts
│   ├── azure-devops.md
│   └── azure-portal.md
├── .vscode/
│   ├── settings.json
│   └── extensions.json
└── mcp-configs/                 # MCP server configurations
    ├── azure-devops.json
    └── azure-portal.json
```

---

## 2. Understanding .github-instructions.md

### What is .github-instructions.md?

The `.github-instructions.md` file is a special markdown file that defines how AI agents (like GitHub Copilot) should behave in your project. It serves as a persistent instruction set that shapes agent responses.

### How It Works

1. **Automatic Loading**: VS Code automatically loads this file when you interact with Copilot
2. **Context Injection**: The content is injected into the agent's context
3. **Behavior Modification**: Instructions guide how the agent responds to your requests

### Basic Structure

A typical `.github-instructions.md` file contains:

```markdown
# Project Agent Instructions

## Role and Purpose
Define what the agent should act as (e.g., "Azure DevOps Expert", "Python Developer")

## Guidelines
- Key principles the agent should follow
- Code style preferences
- Communication style

## Available Tools and Resources
- List of MCP servers available
- External APIs or services
- Documentation references

## Common Tasks
### Task 1: [Description]
Step-by-step instructions for common workflows

### Task 2: [Description]
Another common workflow

## Constraints and Limitations
- What the agent should NOT do
- Security considerations
- Access limitations
```

### Example: Basic .github-instructions.md

See the [.github-instructions.md](.github-instructions.md) file in this repository for a complete example.

### Best Practices

1. **Be Specific**: Clear, detailed instructions yield better results
2. **Use Structure**: Organize with headers, lists, and code blocks
3. **Include Examples**: Show expected input/output patterns
4. **Update Regularly**: Refine based on agent performance
5. **Version Control**: Track changes to understand behavior evolution

### Common Patterns

#### Pattern 1: Role-Based Instructions
```markdown
You are a senior Azure DevOps engineer specializing in CI/CD pipelines...
```

#### Pattern 2: Tool-Specific Guidance
```markdown
When querying Azure DevOps:
1. Always specify the project name
2. Use the azure-devops MCP server
3. Format results in tables
```

#### Pattern 3: Security Guidelines
```markdown
Never expose:
- Personal access tokens
- Connection strings
- API keys
```

---

## 3. Creating Your First Markdown-Driven Agent

### Step 3.1: Define Your Agent's Purpose

Start by creating a `.github-instructions.md` file:

```bash
touch .github-instructions.md
```

Add the following content:

```markdown
# My First Agent

## Role
You are a helpful assistant that specializes in Azure DevOps pipeline management.

## Capabilities
- Query build pipeline status
- List work items
- Analyze pipeline failures
- Suggest optimizations

## Guidelines
- Always provide clear, actionable responses
- Format data in tables when appropriate
- Include links to Azure DevOps when relevant
- Prioritize security best practices

## Communication Style
- Be concise and professional
- Use bullet points for lists
- Provide examples when explaining concepts
```

### Step 3.2: Create Context-Specific Markdown Files

Create `contexts/azure-devops.md`:

```markdown
# Azure DevOps Context

## Organization Details
- Organization: [Your Org Name]
- Projects: [List key projects]

## Common Queries

### Get Build Status
Use the azure-devops MCP server to query:
- Project: [project-name]
- Definition ID: [build-id]

### List Recent Work Items
Filter by:
- Area Path: [team-area]
- Iteration: Current sprint
- State: Active

## Pipeline Patterns

### CI Pipeline
- Trigger on PR
- Run tests
- Build artifacts

### CD Pipeline
- Deploy to staging
- Run smoke tests
- Promote to production
```

### Step 3.3: Test Your Agent

1. Open Copilot Chat (Cmd+Shift+I)
2. Ask a question related to your agent's domain:
   ```
   What are the steps to check the status of a build pipeline?
   ```
3. Observe how the agent uses your `.github-instructions.md` context

### Step 3.4: Refine Based on Results

- If responses are too generic, add more specific instructions
- If agent misunderstands, clarify in the markdown
- Add examples of good responses in your instructions

---

## 4. Adding MCP Server Connections

### What are MCP Servers?

MCP (Model Context Protocol) servers provide agents with access to external data sources and tools. They act as bridges between your AI agent and services like Azure DevOps or Azure Portal.

### Step 4.1: Understanding MCP Configuration

MCP servers are configured in VS Code settings. Each server requires:
- **Command**: The executable or script to run
- **Arguments**: Configuration parameters
- **Environment Variables**: Authentication credentials

### Step 4.2: Configure Azure DevOps MCP Server

#### Option A: Using Pre-built MCP Server

1. Install the Azure DevOps MCP server:

```bash
npm install -g @modelcontextprotocol/server-azure-devops
```

2. Add to your VS Code settings (`.vscode/settings.json`):

```json
{
  "mcp.servers": {
    "azure-devops": {
      "command": "mcp-server-azure-devops",
      "args": [],
      "env": {
        "AZURE_DEVOPS_ORG": "your-organization",
        "AZURE_DEVOPS_PAT": "${env:AZURE_DEVOPS_PAT}"
      }
    }
  }
}
```

3. Set up your Personal Access Token (PAT):

```bash
# Add to your shell profile (.zshrc or .bashrc)
export AZURE_DEVOPS_PAT="your-pat-here"
```

#### Option B: Using Azure DevOps CLI with MCP Wrapper

Create `mcp-configs/azure-devops-wrapper.js`:

```javascript
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class AzureDevOpsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'azure-devops',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'list_builds',
            description: 'List recent builds for a project',
            inputSchema: {
              type: 'object',
              properties: {
                project: { type: 'string' },
                top: { type: 'number', default: 10 }
              },
              required: ['project']
            }
          },
          {
            name: 'get_work_items',
            description: 'Query work items',
            inputSchema: {
              type: 'object',
              properties: {
                project: { type: 'string' },
                wiql: { type: 'string' }
              },
              required: ['project', 'wiql']
            }
          }
        ]
      };
    });

    // Execute tool calls
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'list_builds':
          return await this.listBuilds(args.project, args.top);
        case 'get_work_items':
          return await this.getWorkItems(args.project, args.wiql);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async listBuilds(project, top = 10) {
    const cmd = `az pipelines build list --project "${project}" --top ${top} --output json`;
    const { stdout } = await execAsync(cmd);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(JSON.parse(stdout), null, 2)
        }
      ]
    };
  }

  async getWorkItems(project, wiql) {
    const cmd = `az boards query --wiql "${wiql}" --project "${project}" --output json`;
    const { stdout } = await execAsync(cmd);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(JSON.parse(stdout), null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new AzureDevOpsMCPServer();
server.run().catch(console.error);
```

Make it executable:

```bash
chmod +x mcp-configs/azure-devops-wrapper.js
```

Add to VS Code settings:

```json
{
  "mcp.servers": {
    "azure-devops": {
      "command": "node",
      "args": ["./mcp-configs/azure-devops-wrapper.js"],
      "env": {
        "AZURE_DEVOPS_ORG": "your-org"
      }
    }
  }
}
```

### Step 4.3: Configure Azure Portal MCP Server

For Azure Portal/Resource Manager access:

```json
{
  "mcp.servers": {
    "azure-portal": {
      "command": "mcp-server-azure",
      "args": [],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${env:AZURE_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${env:AZURE_TENANT_ID}"
      }
    }
  }
}
```

Set up Azure authentication:

```bash
# Login to Azure
az login

# Set environment variables
export AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
export AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)
```

### Step 4.4: Verify MCP Server Connection

1. Restart VS Code to load new MCP server configurations
2. Open Copilot Chat
3. Test the connection:
   ```
   @azure-devops list recent builds for project MyProject
   ```

### Step 4.5: Update .github-instructions.md

Add MCP server information to your instructions:

```markdown
## Available MCP Servers

### azure-devops
- Purpose: Query Azure DevOps data
- Tools:
  - list_builds: Get recent builds
  - get_work_items: Query work items
  - get_pull_requests: List PRs

### azure-portal
- Purpose: Manage Azure resources
- Tools:
  - list_resources: List resources in subscription
  - get_resource: Get resource details
  - update_resource: Modify resource configuration

## Using MCP Servers

When a user asks about Azure DevOps data:
1. Use the appropriate MCP server tool
2. Format results in a clear, readable format
3. Provide links to the Azure DevOps portal
4. Suggest next steps or related queries
```

---

## 5. Using Agents with MCP Servers

### Step 5.1: Basic Queries

Once your MCP servers are configured, you can interact with them through Copilot Chat.

#### Example 1: Query Build Status

In Copilot Chat:
```
Show me the last 5 builds for the WebApp project
```

The agent will:
1. Recognize this requires Azure DevOps data
2. Use the azure-devops MCP server
3. Call the `list_builds` tool
4. Format and present the results

#### Example 2: Analyze Work Items

```
What are the active bugs in the current sprint?
```

The agent will construct a WIQL query and fetch relevant work items.

### Step 5.2: Complex Multi-Step Workflows

#### Example: Pipeline Health Check

Create a context file `contexts/pipeline-health.md`:

```markdown
# Pipeline Health Check Workflow

## Steps
1. Get last 10 builds for the project
2. Calculate success rate
3. Identify failed builds
4. Analyze failure reasons
5. Provide recommendations

## Expected Output Format
### Pipeline Health Summary
- Project: [name]
- Success Rate: [percentage]
- Failed Builds: [count]

### Failed Builds
| Build ID | Branch | Status | Time | Reason |
|----------|--------|--------|------|--------|
| ...      | ...    | ...    | ...  | ...    |

### Recommendations
- [Specific actions to improve pipeline health]
```

In Copilot Chat:
```
Perform a pipeline health check for WebApp project using the workflow in contexts/pipeline-health.md
```

### Step 5.3: Combining Multiple MCP Servers

#### Example: Azure Resource Pipeline Integration

```
List all App Services in my subscription and show which ones have active CI/CD pipelines configured
```

This query requires:
1. Azure Portal MCP server (list App Services)
2. Azure DevOps MCP server (find related pipelines)
3. Correlation logic (match resources to pipelines)

### Step 5.4: Creating Reusable Agent Commands

Define custom commands in `.github-instructions.md`:

```markdown
## Custom Commands

### /deploy-status
When user types `/deploy-status [project]`:
1. Get latest release pipeline runs
2. Show deployment status for each environment
3. Highlight any failures or warnings
4. Provide links to Azure Portal resources

### /sprint-summary
When user types `/sprint-summary [team]`:
1. Query current sprint work items
2. Calculate completion percentage
3. List blocked items
4. Show burndown data

### /resource-health
When user types `/resource-health [resource-group]`:
1. List all resources in the group
2. Check health status for each
3. Show any alerts or issues
4. Recommend optimizations
```

### Step 5.5: Error Handling and Debugging

If an MCP server call fails:

1. **Check Server Status**: Verify MCP server is running
   ```bash
   # Check VS Code Output panel > MCP Servers
   ```

2. **Validate Credentials**: Ensure environment variables are set
   ```bash
   echo $AZURE_DEVOPS_PAT
   echo $AZURE_SUBSCRIPTION_ID
   ```

3. **Test Manually**: Run the underlying command directly
   ```bash
   az pipelines build list --project MyProject
   ```

4. **Review Logs**: Check the MCP server logs in VS Code Output

---

## 6. Advanced: Building Custom MCP Servers

For advanced users who want to build custom MCP servers to expose additional data sources or tools.

### When to Build a Custom MCP Server

Consider building a custom MCP server when:
- No existing server provides the functionality you need
- You want to integrate proprietary internal tools
- You need custom business logic or data transformations
- You want to combine multiple APIs into a unified interface

### Prerequisites

- **Python**: Version 3.10+ (for Python servers)
- **C#**: .NET 8.0+ (for C# servers)
- **MCP SDK**: Official SDK for your chosen language
- **Understanding of async programming**: MCP uses async I/O

### Option A: Python MCP Server

See [advanced/MCP_SERVER_GUIDE.md](advanced/MCP_SERVER_GUIDE.md) for detailed instructions on building Python-based MCP servers.

### Option B: C# MCP Server

See [advanced/MCP_SERVER_GUIDE.md](advanced/MCP_SERVER_GUIDE.md) for detailed instructions on building C#-based MCP servers.

### Quick Start: Python Example

```python
#!/usr/bin/env python3
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

app = Server("my-custom-server")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="greet",
            description="Greet a user",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string"}
                },
                "required": ["name"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "greet":
        user_name = arguments.get("name", "World")
        return [TextContent(
            type="text",
            text=f"Hello, {user_name}!"
        )]
    raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

### Testing Your MCP Server

1. **Add to VS Code settings**:
```json
{
  "mcp.servers": {
    "my-custom-server": {
      "command": "python3",
      "args": ["./my-server.py"]
    }
  }
}
```

2. **Restart VS Code**

3. **Test in Copilot Chat**:
```
@my-custom-server greet John
```

---

## Next Steps

🎉 **Congratulations!** You've completed the tutorial. Here are some next steps:

1. **Explore Examples**: Check the `examples/` directory for more patterns
2. **Build Your Own**: Create domain-specific agents for your workflows
3. **Share**: Contribute your MCP servers and agent configs to the community
4. **Learn More**: Review the [Reading List](README.md#-reading-list) for deeper knowledge

## Troubleshooting

### Common Issues

**Issue**: Agent doesn't seem to use .github-instructions.md
- **Solution**: Ensure the file is in the root of your workspace
- Restart VS Code after making changes
- Check that file is named exactly `.github-instructions.md`

**Issue**: MCP server not responding
- **Solution**: Check VS Code Output panel > MCP Servers
- Verify environment variables are set
- Ensure server script has execute permissions
- Test the underlying command manually

**Issue**: Authentication failures
- **Solution**: Refresh tokens/credentials
- Verify PAT/credentials have required permissions
- Check expiration dates

## Getting Help

- **Documentation**: [Model Context Protocol](https://modelcontextprotocol.io)
- **GitHub Issues**: Report bugs in this repository
- **Community**: Join discussions on GitHub Discussions
- **Claude Documentation**: [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

---

Happy agent building! 🚀
