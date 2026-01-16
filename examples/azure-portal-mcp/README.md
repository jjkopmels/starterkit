# Azure Portal MCP Server Configuration

This directory contains configuration and examples for connecting to Azure Portal/Resource Manager through an MCP server.

## Configuration

### Option 1: VS Code Settings

Add to your `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "azure-portal": {
      "command": "node",
      "args": ["./examples/azure-portal-mcp/server.js"],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${env:AZURE_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${env:AZURE_TENANT_ID}"
      }
    }
  }
}
```

## Azure Authentication

This server uses Azure CLI authentication. Ensure you're logged in:

```bash
# Login to Azure
az login

# Set default subscription (optional)
az account set --subscription "Your Subscription Name"

# Verify authentication
az account show
```

## Setting Environment Variables

```bash
# Get your subscription ID
export AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Get your tenant ID
export AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)

# Add to your shell profile for persistence
echo "export AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)" >> ~/.zshrc
echo "export AZURE_TENANT_ID=$(az account show --query tenantId -o tsv)" >> ~/.zshrc
```

## Available Tools

### list_resources
List Azure resources in a subscription or resource group.

**Parameters**:
- `resourceGroup` (string, optional): Filter by resource group
- `resourceType` (string, optional): Filter by resource type (e.g., "Microsoft.Web/sites")

**Example**:
```
@azure-portal list all resources in rg-production
```

### get_resource
Get details of a specific Azure resource.

**Parameters**:
- `resourceId` (string, required): Full resource ID

**Example**:
```
@azure-portal show details for app service myapp
```

### list_resource_groups
List all resource groups in the subscription.

**Parameters**: None

**Example**:
```
@azure-portal list all resource groups
```

### get_resource_health
Check health status of Azure resources.

**Parameters**:
- `resourceGroup` (string, optional): Filter by resource group

**Example**:
```
@azure-portal check health of resources in production
```

### list_app_services
List Azure App Services.

**Parameters**:
- `resourceGroup` (string, optional): Filter by resource group

**Example**:
```
@azure-portal show all app services
```

### list_storage_accounts
List Azure Storage Accounts.

**Parameters**:
- `resourceGroup` (string, optional): Filter by resource group

**Example**:
```
@azure-portal list storage accounts
```

## Installation

Install dependencies:

```bash
cd examples/azure-portal-mcp
npm install
```

## Testing the Connection

1. Ensure Azure CLI is installed and authenticated
2. Set environment variables
3. Restart VS Code
4. Open Copilot Chat and try:
   ```
   @azure-portal list all resource groups
   ```

## Troubleshooting

### Issue: "Authentication failed"
- Run `az login` to re-authenticate
- Verify subscription access: `az account show`
- Check environment variables are set

### Issue: "Subscription not found"
- List available subscriptions: `az account list`
- Set correct subscription: `az account set --subscription "name"`

### Issue: "Insufficient permissions"
- You need at least Reader role on the subscription/resource group
- Contact your Azure administrator to grant access

## Example Queries

```
List all resources in the production resource group

Show details of the web app called myapi

What's the health status of all resources?

List all App Services and their locations

Show storage accounts with their SKUs
```

## Security Best Practices

1. **Use Managed Identities** when possible
   - For production, prefer managed identities over service principals
   - Avoid storing credentials in code

2. **Principle of Least Privilege**
   - Grant minimum required permissions
   - Use Reader role unless write access is needed

3. **Audit Access**
   - Regularly review Azure AD access logs
   - Monitor resource access patterns

4. **Use Resource Locks**
   - Protect critical resources from accidental deletion
   - Use CanNotDelete or ReadOnly locks

## Azure Resource Types Reference

Common resource types you can filter by:

- `Microsoft.Web/sites` - App Services
- `Microsoft.Storage/storageAccounts` - Storage Accounts
- `Microsoft.KeyVault/vaults` - Key Vaults
- `Microsoft.Sql/servers` - SQL Servers
- `Microsoft.ContainerRegistry/registries` - Container Registries
- `Microsoft.Compute/virtualMachines` - Virtual Machines
- `Microsoft.Network/virtualNetworks` - Virtual Networks

## Additional Resources

- [Azure CLI Documentation](https://docs.microsoft.com/en-us/cli/azure/)
- [Azure Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/)
- [Azure RBAC](https://docs.microsoft.com/en-us/azure/role-based-access-control/)
