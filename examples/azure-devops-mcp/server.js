#!/usr/bin/env node

/**
 * Azure DevOps MCP Server
 * 
 * This MCP server provides access to Azure DevOps data and operations.
 * It wraps the Azure DevOps CLI and REST API to expose tools that can be
 * used by AI agents through the Model Context Protocol.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration from environment variables
const AZURE_DEVOPS_ORG = process.env.AZURE_DEVOPS_ORG;
const AZURE_DEVOPS_PAT = process.env.AZURE_DEVOPS_PAT;

if (!AZURE_DEVOPS_ORG || !AZURE_DEVOPS_PAT) {
  console.error('Error: AZURE_DEVOPS_ORG and AZURE_DEVOPS_PAT environment variables are required');
  process.exit(1);
}

class AzureDevOpsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'azure-devops',
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
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_builds',
            description: 'List recent builds for a project',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'The name of the Azure DevOps project'
                },
                top: {
                  type: 'number',
                  description: 'Number of builds to return',
                  default: 10
                },
                status: {
                  type: 'string',
                  description: 'Filter by build status',
                  enum: ['succeeded', 'failed', 'canceled', 'inProgress']
                }
              },
              required: ['project']
            }
          },
          {
            name: 'get_build',
            description: 'Get detailed information about a specific build',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'The name of the Azure DevOps project'
                },
                buildId: {
                  type: 'number',
                  description: 'The ID of the build'
                }
              },
              required: ['project', 'buildId']
            }
          },
          {
            name: 'list_work_items',
            description: 'Query work items using WIQL',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'The name of the Azure DevOps project'
                },
                wiql: {
                  type: 'string',
                  description: 'WIQL query string'
                }
              },
              required: ['project', 'wiql']
            }
          },
          {
            name: 'get_work_item',
            description: 'Get details of a specific work item',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'The name of the Azure DevOps project'
                },
                workItemId: {
                  type: 'number',
                  description: 'The ID of the work item'
                }
              },
              required: ['project', 'workItemId']
            }
          },
          {
            name: 'list_pull_requests',
            description: 'List pull requests for a repository',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'The name of the Azure DevOps project'
                },
                repository: {
                  type: 'string',
                  description: 'The name of the repository'
                },
                status: {
                  type: 'string',
                  description: 'Filter by PR status',
                  enum: ['active', 'completed', 'abandoned', 'all'],
                  default: 'active'
                }
              },
              required: ['project', 'repository']
            }
          },
          {
            name: 'list_releases',
            description: 'List release pipeline runs',
            inputSchema: {
              type: 'object',
              properties: {
                project: {
                  type: 'string',
                  description: 'The name of the Azure DevOps project'
                },
                definitionId: {
                  type: 'number',
                  description: 'Specific release definition ID (optional)'
                },
                top: {
                  type: 'number',
                  description: 'Number of releases to return',
                  default: 10
                }
              },
              required: ['project']
            }
          }
        ]
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_builds':
            return await this.listBuilds(args.project, args.top, args.status);
          case 'get_build':
            return await this.getBuild(args.project, args.buildId);
          case 'list_work_items':
            return await this.listWorkItems(args.project, args.wiql);
          case 'get_work_item':
            return await this.getWorkItem(args.project, args.workItemId);
          case 'list_pull_requests':
            return await this.listPullRequests(args.project, args.repository, args.status);
          case 'list_releases':
            return await this.listReleases(args.project, args.definitionId, args.top);
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
    const fullCommand = `${command} --org https://dev.azure.com/${AZURE_DEVOPS_ORG}`;
    const { stdout, stderr } = await execAsync(fullCommand, {
      env: {
        ...process.env,
        AZURE_DEVOPS_EXT_PAT: AZURE_DEVOPS_PAT
      }
    });

    if (stderr && !stderr.includes('WARNING')) {
      throw new Error(stderr);
    }

    return stdout;
  }

  async listBuilds(project, top = 10, status) {
    let command = `az pipelines build list --project "${project}" --top ${top} --output json`;
    if (status) {
      command += ` --status ${status}`;
    }

    const output = await this.executeAzCommand(command);
    const builds = JSON.parse(output);

    const formattedBuilds = builds.map(build => ({
      id: build.id,
      buildNumber: build.buildNumber,
      status: build.status,
      result: build.result,
      sourceBranch: build.sourceBranch,
      startTime: build.startTime,
      finishTime: build.finishTime,
      requestedFor: build.requestedFor?.displayName,
      url: build._links?.web?.href
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(formattedBuilds, null, 2)
        }
      ]
    };
  }

  async getBuild(project, buildId) {
    const command = `az pipelines build show --project "${project}" --id ${buildId} --output json`;
    const output = await this.executeAzCommand(command);
    const build = JSON.parse(output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(build, null, 2)
        }
      ]
    };
  }

  async listWorkItems(project, wiql) {
    const command = `az boards query --project "${project}" --wiql "${wiql}" --output json`;
    const output = await this.executeAzCommand(command);
    const workItems = JSON.parse(output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(workItems, null, 2)
        }
      ]
    };
  }

  async getWorkItem(project, workItemId) {
    const command = `az boards work-item show --id ${workItemId} --org https://dev.azure.com/${AZURE_DEVOPS_ORG} --output json`;
    const output = await this.executeAzCommand(command);
    const workItem = JSON.parse(output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(workItem, null, 2)
        }
      ]
    };
  }

  async listPullRequests(project, repository, status = 'active') {
    const command = `az repos pr list --project "${project}" --repository "${repository}" --status ${status} --output json`;
    const output = await this.executeAzCommand(command);
    const prs = JSON.parse(output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(prs, null, 2)
        }
      ]
    };
  }

  async listReleases(project, definitionId, top = 10) {
    let command = `az pipelines release list --project "${project}" --top ${top} --output json`;
    if (definitionId) {
      command += ` --definition-id ${definitionId}`;
    }

    const output = await this.executeAzCommand(command);
    const releases = JSON.parse(output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(releases, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Azure DevOps MCP server running on stdio');
  }
}

// Start the server
const server = new AzureDevOpsMCPServer();
server.run().catch(console.error);
