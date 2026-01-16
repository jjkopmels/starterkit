using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CustomMcpServer
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddEnvironmentVariables()
                .Build();

            // Setup dependency injection
            var services = new ServiceCollection();
            
            // Add logging
            services.AddLogging(builder =>
            {
                builder.AddConsole();
                builder.AddConfiguration(configuration.GetSection("Logging"));
            });

            // Add configuration
            services.AddSingleton<IConfiguration>(configuration);

            // Add services
            services.AddSingleton<ApiService>();
            services.AddSingleton<McpServerImplementation>();

            // Build service provider
            var serviceProvider = services.BuildServiceProvider();

            // Get logger
            var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Custom MCP Server starting...");

            // Run server
            var server = serviceProvider.GetRequiredService<McpServerImplementation>();
            
            try
            {
                await server.RunAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Fatal error occurred");
                Environment.Exit(1);
            }
        }
    }
}
