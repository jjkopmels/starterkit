using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace CustomMcpServer
{
    /// <summary>
    /// Simplified MCP Server implementation for demonstration
    /// Note: This is a basic implementation. Use official SDK when available.
    /// </summary>
    public class McpServerImplementation
    {
        private readonly ILogger<McpServerImplementation> _logger;
        private readonly ApiService _apiService;

        public McpServerImplementation(
            ILogger<McpServerImplementation> logger,
            ApiService apiService)
        {
            _logger = logger;
            _apiService = apiService;
        }

        public async Task RunAsync()
        {
            _logger.LogInformation("MCP Server initialized and listening on stdio");

            // In a real implementation, this would:
            // 1. Read from stdin for MCP protocol messages
            // 2. Parse JSON-RPC requests
            // 3. Handle initialize, list_tools, call_tool, etc.
            // 4. Write responses to stdout

            // For this example, we'll demonstrate the tool structure
            await Task.CompletedTask;
        }

        public List<Tool> GetTools()
        {
            return new List<Tool>
            {
                new Tool
                {
                    Name = "get_user",
                    Description = "Fetch user information from the API",
                    InputSchema = new
                    {
                        type = "object",
                        properties = new
                        {
                            userId = new
                            {
                                type = "string",
                                description = "The ID of the user to fetch"
                            }
                        },
                        required = new[] { "userId" }
                    }
                },
                new Tool
                {
                    Name = "search",
                    Description = "Search for items in the API",
                    InputSchema = new
                    {
                        type = "object",
                        properties = new
                        {
                            query = new
                            {
                                type = "string",
                                description = "Search query string"
                            },
                            category = new
                            {
                                type = "string",
                                description = "Optional category filter"
                            },
                            limit = new
                            {
                                type = "integer",
                                description = "Maximum number of results",
                                @default = 10
                            }
                        },
                        required = new[] { "query" }
                    }
                },
                new Tool
                {
                    Name = "list_items",
                    Description = "List items with optional filters",
                    InputSchema = new
                    {
                        type = "object",
                        properties = new
                        {
                            category = new
                            {
                                type = "string",
                                description = "Filter by category"
                            },
                            page = new
                            {
                                type = "integer",
                                description = "Page number",
                                @default = 1
                            },
                            pageSize = new
                            {
                                type = "integer",
                                description = "Items per page",
                                @default = 20
                            }
                        }
                    }
                }
            };
        }

        public async Task<List<Content>> HandleToolCall(string toolName, Dictionary<string, object> arguments)
        {
            _logger.LogInformation($"Handling tool call: {toolName}");

            return toolName switch
            {
                "get_user" => await HandleGetUser(arguments),
                "search" => await HandleSearch(arguments),
                "list_items" => await HandleListItems(arguments),
                _ => throw new ArgumentException($"Unknown tool: {toolName}")
            };
        }

        private async Task<List<Content>> HandleGetUser(Dictionary<string, object> arguments)
        {
            var userId = arguments["userId"].ToString()!;
            
            try
            {
                var user = await _apiService.GetUserAsync(userId);
                
                return new List<Content>
                {
                    new TextContent
                    {
                        Type = "text",
                        Text = JsonSerializer.Serialize(user, new JsonSerializerOptions 
                        { 
                            WriteIndented = true 
                        })
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching user {userId}");
                return new List<Content>
                {
                    new TextContent
                    {
                        Type = "text",
                        Text = $"Error: {ex.Message}"
                    }
                };
            }
        }

        private async Task<List<Content>> HandleSearch(Dictionary<string, object> arguments)
        {
            var query = arguments["query"].ToString()!;
            var category = arguments.GetValueOrDefault("category")?.ToString();
            var limit = arguments.GetValueOrDefault("limit") as int? ?? 10;

            try
            {
                var results = await _apiService.SearchAsync(query, category, limit);
                
                return new List<Content>
                {
                    new TextContent
                    {
                        Type = "text",
                        Text = JsonSerializer.Serialize(results, new JsonSerializerOptions 
                        { 
                            WriteIndented = true 
                        })
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching for '{query}'");
                return new List<Content>
                {
                    new TextContent
                    {
                        Type = "text",
                        Text = $"Error: {ex.Message}"
                    }
                };
            }
        }

        private async Task<List<Content>> HandleListItems(Dictionary<string, object> arguments)
        {
            var category = arguments.GetValueOrDefault("category")?.ToString();
            var page = arguments.GetValueOrDefault("page") as int? ?? 1;
            var pageSize = arguments.GetValueOrDefault("pageSize") as int? ?? 20;

            try
            {
                var items = await _apiService.ListItemsAsync(category, page, pageSize);
                
                return new List<Content>
                {
                    new TextContent
                    {
                        Type = "text",
                        Text = JsonSerializer.Serialize(items, new JsonSerializerOptions 
                        { 
                            WriteIndented = true 
                        })
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing items");
                return new List<Content>
                {
                    new TextContent
                    {
                        Type = "text",
                        Text = $"Error: {ex.Message}"
                    }
                };
            }
        }
    }

    // Simple data models
    public class Tool
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public object? InputSchema { get; set; }
    }

    public class Content
    {
        public string Type { get; set; } = "";
    }

    public class TextContent : Content
    {
        public TextContent() => Type = "text";
        public string Text { get; set; } = "";
    }

    /// <summary>
    /// Service for interacting with the external API
    /// </summary>
    public class ApiService
    {
        private readonly ILogger<ApiService> _logger;
        private readonly HttpClient _httpClient;

        public ApiService(ILogger<ApiService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(configuration["ApiSettings:BaseUrl"]!)
            };

            var apiKey = configuration["ApiSettings:ApiKey"];
            if (!string.IsNullOrEmpty(apiKey))
            {
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            }
        }

        public async Task<object> GetUserAsync(string userId)
        {
            _logger.LogDebug($"Fetching user {userId}");
            
            // Simulate API call
            await Task.Delay(100);
            
            return new
            {
                id = userId,
                name = "John Doe",
                email = "john@example.com"
            };
        }

        public async Task<object> SearchAsync(string query, string? category, int limit)
        {
            _logger.LogDebug($"Searching for '{query}' in category '{category}'");
            
            // Simulate API call
            await Task.Delay(200);
            
            return new
            {
                query,
                category,
                results = new[] { "Result 1", "Result 2", "Result 3" },
                total = 3
            };
        }

        public async Task<object> ListItemsAsync(string? category, int page, int pageSize)
        {
            _logger.LogDebug($"Listing items: category={category}, page={page}, pageSize={pageSize}");
            
            // Simulate API call
            await Task.Delay(150);
            
            return new
            {
                items = new[] { "Item 1", "Item 2", "Item 3" },
                page,
                pageSize,
                total = 100
            };
        }
    }
}
