# C# MCP Server Example

This is a complete example of a C#-based MCP server that wraps a REST API.

## Features

- RESTful API integration
- Async/await patterns
- Dependency injection
- Configuration management
- Structured logging
- Error handling middleware
- Unit tests with xUnit

## Prerequisites

- .NET 8.0 SDK or later
- VS Code with C# extension (optional)

## Installation

```bash
# Restore dependencies
dotnet restore

# Build project
dotnet build
```

## Configuration

Edit `appsettings.json` or set environment variables:

```json
{
  "ApiSettings": {
    "BaseUrl": "https://api.example.com",
    "ApiKey": "your-api-key",
    "Timeout": 30
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

Environment variables:
```bash
export ApiSettings__BaseUrl="https://api.example.com"
export ApiSettings__ApiKey="your-api-key"
```

## Usage

### Run Locally

```bash
dotnet run
```

### Configure in VS Code

Add to `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "api-server": {
      "command": "dotnet",
      "args": ["run", "--project", "path/to/CustomMcpServer.csproj"],
      "env": {
        "ApiSettings__ApiKey": "your-api-key"
      }
    }
  }
}
```

## Available Tools

### get_user
Fetch user information from the API.

**Example**:
```
@api-server get user by id 123
```

### search
Search for items in the API.

**Example**:
```
@api-server search for products named "laptop"
```

### list_items
List items with optional filters.

**Example**:
```
@api-server list items in category electronics
```

## Project Structure

```
CustomMcpServer/
├── Program.cs              # Main entry point
├── McpServer.cs           # Server implementation
├── Tools/                 # Tool implementations
│   ├── GetUserTool.cs
│   ├── SearchTool.cs
│   └── ListItemsTool.cs
├── Services/              # Business logic
│   └── ApiService.cs
├── Models/                # Data models
│   └── ApiModels.cs
├── Configuration/         # Config classes
│   └── ApiSettings.cs
└── Tests/                 # Unit tests
    └── McpServerTests.cs
```

## Testing

```bash
# Run all tests
dotnet test

# Run with detailed output
dotnet test --logger "console;verbosity=detailed"

# Run with coverage
dotnet test /p:CollectCoverage=true
```

## Building for Production

```bash
# Publish self-contained
dotnet publish -c Release -r win-x64 --self-contained

# Publish framework-dependent
dotnet publish -c Release
```

## Troubleshooting

**Issue**: "Failed to connect to API"
- Verify API base URL is correct
- Check API key is valid
- Ensure network connectivity

**Issue**: "Configuration not found"
- Verify appsettings.json exists
- Check environment variables are set correctly
- Ensure configuration section names match
