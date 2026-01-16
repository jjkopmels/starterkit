# Building Custom MCP Servers

This guide provides detailed instructions for building custom MCP (Model Context Protocol) servers in Python and C#. MCP servers enable AI agents to access external data sources and tools through a standardized protocol.

## Table of Contents

1. [Introduction to MCP Servers](#introduction-to-mcp-servers)
2. [When to Build a Custom MCP Server](#when-to-build-a-custom-mcp-server)
3. [MCP Architecture Overview](#mcp-architecture-overview)
4. [Building a Python MCP Server](#building-a-python-mcp-server)
5. [Building a C# MCP Server](#building-a-c-mcp-server)
6. [Testing Your MCP Server](#testing-your-mcp-server)
7. [Deployment and Distribution](#deployment-and-distribution)
8. [Best Practices](#best-practices)

---

## Introduction to MCP Servers

Model Context Protocol (MCP) servers are applications that expose resources and tools to AI agents through a standardized interface. They act as bridges between AI models and external systems, enabling agents to:

- **Access Data**: Read from databases, APIs, file systems
- **Perform Actions**: Execute commands, update records, trigger workflows
- **Provide Context**: Supply domain-specific knowledge and capabilities

### Key Concepts

- **Server**: The application that provides capabilities (what you build)
- **Client**: The AI agent or application consuming the server (e.g., VS Code Copilot)
- **Transport**: Communication mechanism (usually stdio for local servers)
- **Resources**: Data endpoints that can be read
- **Tools**: Actions that can be executed
- **Prompts**: Reusable templates for common tasks

---

## When to Build a Custom MCP Server

Consider building a custom MCP server when:

### ✅ Good Use Cases

1. **Proprietary Systems**: Your organization has internal tools or databases not covered by existing servers
2. **Custom Business Logic**: You need specialized data transformations or workflows
3. **API Aggregation**: Combining multiple APIs into a unified interface
4. **Legacy System Integration**: Bridging older systems with modern AI tools
5. **Specialized Domains**: Industry-specific data sources (medical, financial, etc.)

### ❌ When NOT to Build

1. **Existing Server Available**: Check the [MCP Server Registry](https://github.com/modelcontextprotocol/servers) first
2. **Simple REST API**: If a simple HTTP client would suffice
3. **One-Time Use**: For single-use data fetching, consider other approaches
4. **Frequent Schema Changes**: If the data model changes constantly, maintenance will be challenging

---

## MCP Architecture Overview

### Communication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │  stdio  │             │  calls  │             │
│  AI Agent   │◄───────►│ MCP Server  │────────►│  External   │
│  (Client)   │         │  (Your App) │         │  Service    │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

### Core Components

1. **Server Initialization**: Declare capabilities (resources, tools, prompts)
2. **Request Handlers**: Implement logic for each capability
3. **Transport Layer**: Handle communication (usually stdio)
4. **Error Handling**: Gracefully handle failures and provide helpful messages

### Protocol Messages

- **Initialize**: Client and server exchange capabilities
- **List Tools**: Client requests available tools
- **Call Tool**: Client invokes a specific tool with arguments
- **List Resources**: Client requests available resources
- **Read Resource**: Client fetches specific resource content

---

## Building a Python MCP Server

### Prerequisites

```bash
# Python 3.10 or higher required
python3 --version

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install MCP SDK
pip install mcp
```

### Project Structure

```
python-mcp-example/
├── server.py           # Main server implementation
├── requirements.txt    # Python dependencies
├── README.md          # Documentation
└── tests/             # Unit tests
    └── test_server.py
```

### Basic Server Template

Create `server.py`:

```python
#!/usr/bin/env python3
"""
Custom MCP Server Example
This server demonstrates how to build a custom MCP server in Python.
"""

import asyncio
import logging
from typing import Any
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create server instance
app = Server("custom-server")

@app.list_tools()
async def list_tools() -> list[Tool]:
    """
    List all available tools.
    This is called when the client wants to know what the server can do.
    """
    return [
        Tool(
            name="echo",
            description="Echo back the provided message",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The message to echo"
                    }
                },
                "required": ["message"]
            }
        ),
        Tool(
            name="calculate",
            description="Perform basic arithmetic calculations",
            inputSchema={
                "type": "object",
                "properties": {
                    "operation": {
                        "type": "string",
                        "enum": ["add", "subtract", "multiply", "divide"],
                        "description": "The arithmetic operation to perform"
                    },
                    "a": {
                        "type": "number",
                        "description": "First operand"
                    },
                    "b": {
                        "type": "number",
                        "description": "Second operand"
                    }
                },
                "required": ["operation", "a", "b"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent | ImageContent | EmbeddedResource]:
    """
    Execute a tool call.
    This is called when the client wants to use one of the tools.
    """
    logger.info(f"Tool called: {name} with arguments: {arguments}")
    
    try:
        if name == "echo":
            return await handle_echo(arguments)
        elif name == "calculate":
            return await handle_calculate(arguments)
        else:
            raise ValueError(f"Unknown tool: {name}")
    except Exception as e:
        logger.error(f"Error executing tool {name}: {e}")
        return [TextContent(
            type="text",
            text=f"Error: {str(e)}"
        )]

async def handle_echo(arguments: dict) -> list[TextContent]:
    """Handle the echo tool."""
    message = arguments.get("message", "")
    return [TextContent(
        type="text",
        text=f"Echo: {message}"
    )]

async def handle_calculate(arguments: dict) -> list[TextContent]:
    """Handle the calculate tool."""
    operation = arguments["operation"]
    a = arguments["a"]
    b = arguments["b"]
    
    result = None
    if operation == "add":
        result = a + b
    elif operation == "subtract":
        result = a - b
    elif operation == "multiply":
        result = a * b
    elif operation == "divide":
        if b == 0:
            raise ValueError("Division by zero")
        result = a / b
    
    return [TextContent(
        type="text",
        text=f"Result: {a} {operation} {b} = {result}"
    )]

async def main():
    """Main entry point for the server."""
    async with stdio_server() as (read_stream, write_stream):
        logger.info("Custom MCP Server starting...")
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
```

### Requirements File

Create `requirements.txt`:

```
mcp>=0.5.0
```

### Advanced Example: Database Server

For a more complex example, see the [python-mcp-example](python-mcp-example/) directory, which includes:
- Database connection handling
- Resource endpoints for data access
- Error handling and logging
- Configuration management
- Unit tests

---

## Building a C# MCP Server

### Prerequisites

```bash
# .NET 8.0 or higher required
dotnet --version

# Create new console project
dotnet new console -n CustomMcpServer
cd CustomMcpServer

# Add MCP SDK (when available - check NuGet)
dotnet add package ModelContextProtocol.Sdk
```

### Project Structure

```
csharp-mcp-example/
├── Program.cs              # Main entry point
├── McpServer.cs           # Server implementation
├── Tools/                 # Tool implementations
│   ├── EchoTool.cs
│   └── CalculateTool.cs
├── CustomMcpServer.csproj # Project file
└── README.md              # Documentation
```

### Basic Server Template

Create `Program.cs`:

```csharp
using System;
using System.Threading.Tasks;
using ModelContextProtocol.Sdk.Server;
using ModelContextProtocol.Sdk.Server.Stdio;

namespace CustomMcpServer
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var server = new CustomServer();
            
            using var transport = new StdioServerTransport();
            
            Console.Error.WriteLine("Custom MCP Server starting...");
            
            await server.RunAsync(transport);
        }
    }
}
```

Create `McpServer.cs`:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ModelContextProtocol.Sdk.Server;
using ModelContextProtocol.Sdk.Types;

namespace CustomMcpServer
{
    public class CustomServer : McpServer
    {
        public CustomServer() : base("custom-server", "1.0.0")
        {
            RegisterToolHandlers();
        }

        private void RegisterToolHandlers()
        {
            // Register list tools handler
            SetListToolsHandler(async () =>
            {
                return new List<Tool>
                {
                    new Tool
                    {
                        Name = "echo",
                        Description = "Echo back the provided message",
                        InputSchema = new
                        {
                            type = "object",
                            properties = new
                            {
                                message = new
                                {
                                    type = "string",
                                    description = "The message to echo"
                                }
                            },
                            required = new[] { "message" }
                        }
                    },
                    new Tool
                    {
                        Name = "calculate",
                        Description = "Perform basic arithmetic calculations",
                        InputSchema = new
                        {
                            type = "object",
                            properties = new
                            {
                                operation = new
                                {
                                    type = "string",
                                    @enum = new[] { "add", "subtract", "multiply", "divide" },
                                    description = "The arithmetic operation to perform"
                                },
                                a = new
                                {
                                    type = "number",
                                    description = "First operand"
                                },
                                b = new
                                {
                                    type = "number",
                                    description = "Second operand"
                                }
                            },
                            required = new[] { "operation", "a", "b" }
                        }
                    }
                };
            });

            // Register call tool handler
            SetCallToolHandler(async (name, arguments) =>
            {
                Console.Error.WriteLine($"Tool called: {name}");
                
                return name switch
                {
                    "echo" => await HandleEcho(arguments),
                    "calculate" => await HandleCalculate(arguments),
                    _ => throw new ArgumentException($"Unknown tool: {name}")
                };
            });
        }

        private async Task<List<Content>> HandleEcho(Dictionary<string, object> arguments)
        {
            var message = arguments["message"].ToString();
            
            return new List<Content>
            {
                new TextContent
                {
                    Type = "text",
                    Text = $"Echo: {message}"
                }
            };
        }

        private async Task<List<Content>> HandleCalculate(Dictionary<string, object> arguments)
        {
            var operation = arguments["operation"].ToString();
            var a = Convert.ToDouble(arguments["a"]);
            var b = Convert.ToDouble(arguments["b"]);
            
            double result = operation switch
            {
                "add" => a + b,
                "subtract" => a - b,
                "multiply" => a * b,
                "divide" => b != 0 ? a / b : throw new DivideByZeroException(),
                _ => throw new ArgumentException($"Unknown operation: {operation}")
            };
            
            return new List<Content>
            {
                new TextContent
                {
                    Type = "text",
                    Text = $"Result: {a} {operation} {b} = {result}"
                }
            };
        }
    }
}
```

### Advanced Example: API Integration Server

For a more complex example, see the [csharp-mcp-example](csharp-mcp-example/) directory, which includes:
- Async/await patterns
- Dependency injection
- Configuration management
- Structured logging
- Error handling middleware
- Unit tests with xUnit

---

## Testing Your MCP Server

### Manual Testing

#### 1. Test with MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Run your server through the inspector
mcp-inspector python server.py
# or
mcp-inspector dotnet run
```

#### 2. Test in VS Code

Add to `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "custom-server": {
      "command": "python",
      "args": ["path/to/server.py"]
    }
  }
}
```

Restart VS Code and test in Copilot Chat:
```
@custom-server echo Hello, World!
@custom-server calculate add 5 and 3
```

### Automated Testing

#### Python Unit Tests

Create `tests/test_server.py`:

```python
import pytest
from server import handle_echo, handle_calculate

@pytest.mark.asyncio
async def test_echo():
    result = await handle_echo({"message": "test"})
    assert len(result) == 1
    assert "test" in result[0].text

@pytest.mark.asyncio
async def test_calculate_add():
    result = await handle_calculate({"operation": "add", "a": 5, "b": 3})
    assert "8" in result[0].text

@pytest.mark.asyncio
async def test_calculate_divide_by_zero():
    with pytest.raises(ValueError):
        await handle_calculate({"operation": "divide", "a": 5, "b": 0})
```

Run tests:
```bash
pip install pytest pytest-asyncio
pytest tests/
```

#### C# Unit Tests

Create `Tests/McpServerTests.cs`:

```csharp
using Xunit;
using CustomMcpServer;

public class McpServerTests
{
    [Fact]
    public async Task TestEcho()
    {
        var server = new CustomServer();
        var args = new Dictionary<string, object> { ["message"] = "test" };
        
        var result = await server.HandleEcho(args);
        
        Assert.Single(result);
        Assert.Contains("test", result[0].Text);
    }
    
    [Theory]
    [InlineData("add", 5, 3, 8)]
    [InlineData("subtract", 10, 4, 6)]
    [InlineData("multiply", 3, 4, 12)]
    public async Task TestCalculate(string op, double a, double b, double expected)
    {
        var server = new CustomServer();
        var args = new Dictionary<string, object>
        {
            ["operation"] = op,
            ["a"] = a,
            ["b"] = b
        };
        
        var result = await server.HandleCalculate(args);
        
        Assert.Contains(expected.ToString(), result[0].Text);
    }
}
```

Run tests:
```bash
dotnet test
```

---

## Deployment and Distribution

### Local Development

For development and testing, run the server locally:

```bash
# Python
python server.py

# C#
dotnet run
```

### Package for Distribution

#### Python Package

Create `setup.py`:

```python
from setuptools import setup, find_packages

setup(
    name="custom-mcp-server",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "mcp>=0.5.0",
    ],
    entry_points={
        "console_scripts": [
            "custom-mcp-server=server:main",
        ],
    },
)
```

Install and distribute:
```bash
pip install -e .
# Or build wheel
python setup.py bdist_wheel
```

#### C# Package

Build and publish:
```bash
dotnet publish -c Release -o dist/
```

### Docker Deployment

For servers that need external dependencies:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY server.py .

ENTRYPOINT ["python", "server.py"]
```

Build and run:
```bash
docker build -t custom-mcp-server .
docker run -i custom-mcp-server
```

---

## Best Practices

### 1. Error Handling

Always provide helpful error messages:

```python
try:
    # Your logic
    pass
except SpecificException as e:
    logger.error(f"Specific error: {e}")
    return [TextContent(
        type="text",
        text=f"Error: {str(e)}. Please check your input and try again."
    )]
```

### 2. Input Validation

Validate all inputs before processing:

```python
def validate_input(arguments: dict, required_keys: list[str]):
    for key in required_keys:
        if key not in arguments:
            raise ValueError(f"Missing required argument: {key}")
```

### 3. Logging

Use structured logging for debugging:

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Server started")
logger.debug(f"Processing tool call: {name}")
logger.error(f"Error occurred: {error}")
```

### 4. Configuration

Use environment variables for configuration:

```python
import os

DATABASE_URL = os.getenv("DATABASE_URL")
API_KEY = os.getenv("API_KEY")
```

### 5. Documentation

Document your tools clearly:

```python
Tool(
    name="fetch_data",
    description="Fetch data from the database. Returns records matching the query.",
    inputSchema={
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "SQL query to execute (read-only)"
            }
        },
        "required": ["query"]
    }
)
```

### 6. Security

- Never expose credentials in tool responses
- Validate and sanitize all inputs
- Use parameterized queries for databases
- Implement rate limiting for expensive operations
- Log security-relevant events

### 7. Performance

- Use async/await for I/O operations
- Cache frequently accessed data
- Implement timeouts for external calls
- Consider pagination for large result sets

### 8. Testing

- Write unit tests for all tool handlers
- Test error conditions
- Use integration tests with real dependencies
- Mock external services in tests

---

## Additional Resources

- [MCP Specification](https://modelcontextprotocol.io/docs/specification)
- [Python SDK Documentation](https://github.com/modelcontextprotocol/python-sdk)
- [C# SDK Documentation](https://github.com/modelcontextprotocol/csharp-sdk)
- [Example Servers](https://github.com/modelcontextprotocol/servers)
- [Community Discord](https://discord.gg/modelcontextprotocol)

## Example Projects

Complete working examples:
- [Python Database Server](python-mcp-example/) - Connect to PostgreSQL/MySQL
- [C# API Integration Server](csharp-mcp-example/) - Wrap REST APIs

---

**Happy building!** If you create a useful MCP server, consider contributing it to the [MCP Server Registry](https://github.com/modelcontextprotocol/servers).
