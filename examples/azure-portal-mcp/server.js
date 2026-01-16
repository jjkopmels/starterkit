#!/usr/bin/env node

/**
 * Azure Portal/Resource Manager MCP Server
 * 
 * This MCP server provides access to Azure Resource Manager data.
 * It uses Azure CLI to interact with Azure resources.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const AZURE_SUBSCRIPTION_ID = process.env.AZURE_SUBSCRIPTION_ID;

class AzurePortalMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'azure-portal',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_resources',
            description: 'List Azure resources',
            inputSchema: {
              type: 'object',
              properties: {
                resourceGroup: {
                  type: 'string',
                  description: 'Filter by resource group name'
                },
                resourceType: {
                  type: 'string',
                  description: 'Filter by resource type (e.g., Microsoft.Web/sites)'
                }
              }
            }
          },
          {
            name: 'get_resource',
            description: 'Get details of a specific resource',
            inputSchema: {
              type: 'object',
              properties: {
                resourceId: {
                  type: 'string',
                  description: 'Full resource ID or resource name'
                },
                resourceGroup: {
                  type: 'string',
                  description: 'Resource group name (if using resource name)'
                },
                resourceType: {
                  type: 'string',
                  description: 'Resource type (if using resource name)'
                }
              },
              required: ['resourceId']
            }
          },
          {
            name: 'list_resource_groups',
            description: 'List all resource groups in the subscription',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'get_resource_health',
            description: 'Check health status of resources',
            inputSchema: {
              type: 'object',
              properties: {
                resourceGroup: {
                  type: 'string',
                  description: 'Filter by resource group'
                }
              }
            }
          },
          {
            name: 'list_app_services',
            description: 'List Azure App Services',
            inputSchema: {
              type: 'object',
              properties: {
                resourceGroup: {
                  type: 'string',
                  description: 'Filter by resource group'
                }
              }
            }
          },
          {
            name: 'list_storage_accounts',
            description: 'List Azure Storage Accounts',
            inputSchema: {
              type: 'object',
              properties: {
                resourceGroup: {
                  type: 'string',
                  description: 'Filter by resource group'
                }
              }
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_resources':
            return await this.listResources(args.resourceGroup, args.resourceType);
          case 'get_resource':
            return await this.getResource(args.resourceId, args.resourceGroup, args.resourceType);
          case 'list_resource_groups':
            return await this.listResourceGroups();
          case 'get_resource_health':
            return await this.getResourceHealth(args.resourceGroup);
          case 'list_app_services':
            return await this.listAppServices(args.resourceGroup);
          case 'list_storage_accounts':
            return await this.listStorageAccounts(args.resourceGroup);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async executeAzCommand(command) {
    const subscriptionFlag = AZURE_SUBSCRIPTION_ID ? ` --subscription ${AZURE_SUBSCRIPTION_ID}` : '';
    const fullCommand = `${command}${subscriptionFlag} --output json`;
    
    const { stdout, stderr } = await execAsync(fullCommand);

    if (stderr && !stderr.includes('WARNING')) {
      throw new Error(stderr);
    }

    return stdout;
  }

  async listResources(resourceGroup, resourceType) {
    let command = 'az resource list';
    
    if (resourceGroup) {
      command += ` --resource-group "${resourceGroup}"`;
    }
    
    if (resourceType) {
      command += ` --resource-type "${resourceType}"`;
    }

    const output = await this.executeAzCommand(command);
    const resources = JSON.parse(output);

    const formattedResources = resources.map(resource => ({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      location: resource.location,
      resourceGroup: resource.resourceGroup,
      tags: resource.tags
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(formattedResources, null, 2)
        }
      ]
    };
  }

  async getResource(resourceId, resourceGroup, resourceType) {
    let command;
    
    if (resourceId.startsWith('/subscriptions/')) {
      // Full resource ID provided
      command = `az resource show --ids "${resourceId}"`;
    } else if (resourceGroup && resourceType) {
      // Resource name with group and type
      command = `az resource show --name "${resourceId}" --resource-group "${resourceGroup}" --resource-type "${resourceType}"`;
    } else {
      throw new Error('Either provide full resource ID or resource name with resourceGroup and resourceType');
    }

    const output = await this.executeAzCommand(command);
    const resource = JSON.parse(output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(resource, null, 2)
        }
      ]
    };
  }

  async listResourceGroups() {
    const command = 'az group list';
    const output = await this.executeAzCommand(command);
    const resourceGroups = JSON.parse(output);

    const formatted = resourceGroups.map(rg => ({
      name: rg.name,
      location: rg.location,
      provisioningState: rg.properties.provisioningState,
      tags: rg.tags
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(formatted, null, 2)
        }
      ]
    };
  }

  async getResourceHealth(resourceGroup) {
    // Get resources and their basic health information
    let command = 'az resource list';
    
    if (resourceGroup) {
      command += ` --resource-group "${resourceGroup}"`;
    }

    const output = await this.executeAzCommand(command);
    const resources = JSON.parse(output);

    // For each resource, try to get health information
    const healthInfo = resources.map(resource => ({
      name: resource.name,
      type: resource.type,
      location: resource.location,
      resourceGroup: resource.resourceGroup,
      provisioningState: resource.provisioningState || 'Unknown'
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(healthInfo, null, 2)
        }
      ]
    };
  }

  async listAppServices(resourceGroup) {
    let command = 'az webapp list';
    
    if (resourceGroup) {
      command += ` --resource-group "${resourceGroup}"`;
    }

    const output = await this.executeAzCommand(command);
    const webapps = JSON.parse(output);

    const formatted = webapps.map(app => ({
      name: app.name,
      resourceGroup: app.resourceGroup,
      location: app.location,
      state: app.state,
      defaultHostName: app.defaultHostName,
      appServicePlan: app.serverFarmId,
      httpsOnly: app.httpsOnly,
      ftpsState: app.siteConfig?.ftpsState
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(formatted, null, 2)
        }
      ]
    };
  }

  async listStorageAccounts(resourceGroup) {
    let command = 'az storage account list';
    
    if (resourceGroup) {
      command += ` --resource-group "${resourceGroup}"`;
    }

    const output = await this.executeAzCommand(command);
    const accounts = JSON.parse(output);

    const formatted = accounts.map(account => ({
      name: account.name,
      resourceGroup: account.resourceGroup,
      location: account.location,
      sku: account.sku.name,
      kind: account.kind,
      provisioningState: account.provisioningState,
      primaryEndpoints: account.primaryEndpoints
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(formatted, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Azure Portal MCP server running on stdio');
  }
}

// Start the server
const server = new AzurePortalMCPServer();
server.run().catch(console.error);
