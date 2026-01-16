# Azure DevOps MCP Server Configuration

This directory contains configuration and examples for connecting to Azure DevOps through an MCP server.

## Configuration

### Option 1: VS Code Settings (Recommended)

Add to your `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "azure-devops": {
      "command": "node",
      "args": ["./examples/azure-devops-mcp/server.js"],
      "env": {
        "AZURE_DEVOPS_ORG": "your-organization-name",
        "AZURE_DEVOPS_PAT": "${env:AZURE_DEVOPS_PAT}"
      }
    }
  }
}
```

### Option 2: Using NPM Package

If there's an official Azure DevOps MCP package:

```json
{
  "mcp.servers": {
    "azure-devops": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-azure-devops"],
      "env": {
        "AZURE_DEVOPS_ORG": "your-organization-name",
        "AZURE_DEVOPS_PAT": "${env:AZURE_DEVOPS_PAT}"
      }
    }
  }
}
```

## Setting Up Personal Access Token (PAT)

1. **Generate PAT in Azure DevOps**:
   - Navigate to: `https://dev.azure.com/{your-org}/_usersSettings/tokens`
   - Click "New Token"
   - Set expiration (recommend 90 days)
   - Select scopes:
     - ✅ Build (Read)
     - ✅ Code (Read)
     - ✅ Work Items (Read)
     - ✅ Release (Read)
   - Copy the generated token

2. **Store PAT Securely**:

   On macOS/Linux:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export AZURE_DEVOPS_PAT="your-pat-here"
   
   # Reload shell
   source ~/.zshrc
   ```

   On Windows (PowerShell):
   ```powershell
   # Add to PowerShell profile
   $env:AZURE_DEVOPS_PAT = "your-pat-here"
   
   # Or set as system environment variable
   [System.Environment]::SetEnvironmentVariable('AZURE_DEVOPS_PAT', 'your-pat-here', 'User')
   ```

## Available Tools

The Azure DevOps MCP server provides these tools:

### list_builds
List recent builds for a project.

**Parameters**:
- `project` (string, required): Project name
- `top` (number, optional): Number of builds to return (default: 10)
- `status` (string, optional): Filter by status (succeeded, failed, etc.)

**Example**:
```
@azure-devops list builds for WebApp project
```

### get_build
Get detailed information about a specific build.

**Parameters**:
- `project` (string, required): Project name
- `buildId` (number, required): Build ID

**Example**:
```
@azure-devops get details for build 12345 in WebApp project
```

### list_work_items
Query work items using WIQL (Work Item Query Language).

**Parameters**:
- `project` (string, required): Project name
- `wiql` (string, required): WIQL query

**Example**:
```
@azure-devops list active bugs in current sprint
```

### get_work_item
Get details of a specific work item.

**Parameters**:
- `project` (string, required): Project name
- `workItemId` (number, required): Work item ID

**Example**:
```
@azure-devops show details for work item 5678
```

### list_pull_requests
List pull requests for a repository.

**Parameters**:
- `project` (string, required): Project name
- `repository` (string, required): Repository name
- `status` (string, optional): Filter by status (active, completed, abandoned)

**Example**:
```
@azure-devops list active pull requests for WebApp repository
```

### list_releases
List release pipeline runs.

**Parameters**:
- `project` (string, required): Project name
- `definitionId` (number, optional): Specific release definition
- `top` (number, optional): Number of releases to return

**Example**:
```
@azure-devops show recent releases for WebApp project
```

## Testing the Connection

After configuration, test the connection:

1. Restart VS Code
2. Open Copilot Chat (Cmd+Shift+I)
3. Try a simple query:
   ```
   @azure-devops list recent builds
   ```

## Troubleshooting

### Issue: "MCP server not found"
- Ensure the server script exists at the specified path
- Check that Node.js is installed: `node --version`
- Verify the path in settings.json is correct

### Issue: "Authentication failed"
- Verify PAT is set: `echo $AZURE_DEVOPS_PAT`
- Check PAT hasn't expired in Azure DevOps
- Ensure PAT has required scopes

### Issue: "Project not found"
- Verify organization name is correct
- Check you have access to the project
- Try using project ID instead of name

## Example Queries

Once configured, you can use natural language to interact with Azure DevOps:

```
Show me failed builds from the last week

List all high-priority bugs assigned to me

What's the status of PR #123?

Show deployment history for production environment

Get the last 5 release pipeline runs
```

## Security Best Practices

1. **Never commit PATs to source control**
   - Add `.env` to `.gitignore`
   - Use environment variables
   - Rotate PATs regularly

2. **Use minimal permissions**
   - Only grant scopes needed for your workflows
   - Use separate PATs for different purposes

3. **Monitor PAT usage**
   - Review active PATs in Azure DevOps settings
   - Revoke unused PATs
   - Set expiration dates

## Additional Resources

- [Azure DevOps REST API Documentation](https://docs.microsoft.com/en-us/rest/api/azure/devops/)
- [WIQL Syntax Reference](https://docs.microsoft.com/en-us/azure/devops/boards/queries/wiql-syntax)
- [Model Context Protocol](https://modelcontextprotocol.io)
