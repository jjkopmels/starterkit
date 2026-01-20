# Markdown-Driven Agent Starter Kit

Welcome to the Markdown-Driven Agent Starter Kit! This repository helps you get started with developing AI agents inside VS Code using markdown-driven workflows and Model Context Protocol (MCP) servers.

## 📚 Reading List

### Understanding AI Agents

#### What are AI Agents?
AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. Unlike simple chatbots, agents can:
- Use tools and external resources
- Plan multi-step workflows
- Maintain context across interactions
- Learn and adapt to new situations

**Recommended Reading:**
- [Introduction to AI Agents](https://en.wikipedia.org/wiki/Intelligent_agent) - Fundamental concepts
- [LangChain Agent Documentation](https://python.langchain.com/docs/modules/agents/) - Practical agent patterns
- [AutoGPT and Agent Architectures](https://github.com/Significant-Gravitas/AutoGPT) - Real-world implementations

### Agentic AI

Agentic AI refers to artificial intelligence systems that possess agency - the ability to act independently and make autonomous decisions. Key characteristics include:
- **Autonomy**: Can operate without constant human guidance
- **Goal-directed behavior**: Works towards defined objectives
- **Adaptability**: Adjusts strategies based on feedback
- **Tool use**: Leverages external resources and APIs

**Recommended Reading:**
- [The Rise of Agentic AI](https://www.anthropic.com/research) - Research perspectives
- [Building Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) - Technical deep dive
- [Agent Evaluation Frameworks](https://arxiv.org/search/?query=agent+evaluation&searchtype=all) - Measuring agent performance

### Model Context Protocol (MCP)

MCP is a standardized protocol that enables AI models to securely connect to external data sources and tools. Think of it as a universal adapter that lets your AI agent interact with databases, APIs, file systems, and other resources.

**Core Concepts:**
- **Server**: Provides access to specific resources (e.g., Azure DevOps API)
- **Client**: The AI agent or application consuming the MCP server
- **Resources**: Data or capabilities exposed through the protocol
- **Tools**: Actions the agent can perform through the server
- **Prompts**: Reusable templates for common tasks

**Recommended Reading:**
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction) - Official spec
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers) - Reference implementations
- [Building MCP Servers](https://modelcontextprotocol.io/docs/develop/build-server) - Development guide

### Agent Skills (Claude-Specific)

Claude agents leverage specific skills to accomplish complex tasks. Understanding these skills helps you design effective markdown-driven agents.

**Core Agent Skills:**
- **Extended Thinking**: Breaking down complex problems into manageable steps
- **Tool Use**: Calling functions and APIs to gather information or take actions
- **Computer Use**: Interacting with desktop environments programmatically
- **Memory and Context**: Maintaining state across conversations
- **Planning and Reasoning**: Strategizing multi-step workflows

**Recommended Reading:**
- [Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) - Official documentation
- [Effective Tool Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use) - Best practices
- [Prompt Engineering for Agents](https://docs.anthropic.com/en/docs/agents/prompt-engineering) - Optimization techniques

### Markdown-Driven Development

Markdown-driven agents use structured markdown files to define behavior, context, and workflows. This approach offers:
- **Version control**: Track changes to agent behavior over time
- **Human readability**: Non-technical stakeholders can review agent logic
- **Modularity**: Separate concerns into different markdown files
- **Collaboration**: Team members can contribute without deep technical knowledge

**Key Concepts:**
- `.github-instructions.md`: Define agent behavior and guidelines
- Custom markdown files: Task-specific contexts and workflows
- Structured prompts: Use headers, lists, and code blocks effectively
- Dynamic context injection: Load relevant markdown based on user requests

## 🚀 Getting Started

Ready to build your first markdown-driven agent? Check out the [TUTORIAL.md](TUTORIAL.md) for step-by-step instructions.

## 📂 Repository Structure

```
starterkit/
├── README.md                          # This file - overview and reading list
├── TUTORIAL.md                        # Step-by-step tutorial
├── .github-instructions.md            # Example agent instructions
├── examples/
│   ├── azure-devops-mcp/             # Azure DevOps MCP configuration
│   ├── azure-portal-mcp/             # Azure Portal MCP configuration
│   └── simple-agent.md               # Basic agent example
└── advanced/
    ├── MCP_SERVER_GUIDE.md           # Building custom MCP servers
    ├── python-mcp-example/           # Python MCP server template
    └── csharp-mcp-example/           # C# MCP server template
```

## 🔗 Additional Resources

- [VS Code GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview) - Official documentation
- [Claude API Documentation](https://docs.anthropic.com/) - API reference
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers) - Community servers
- [Agent Development Community](https://discord.gg/anthropic) - Get help and share ideas

## 🤝 Contributing

Found a bug or have a suggestion? Please open an issue or submit a pull request!

## 📄 License

This starter kit is provided as-is for educational purposes.
