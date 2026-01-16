#!/usr/bin/env python3
"""
Database MCP Server Example

This server provides access to a PostgreSQL database through MCP.
It allows AI agents to query database information safely.
"""

import asyncio
import logging
import os
import re
from typing import Any
from urllib.parse import urlparse

import asyncpg
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

# Configure logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Parse database URL
parsed = urlparse(DATABASE_URL)
DB_CONFIG = {
    "host": parsed.hostname,
    "port": parsed.port or 5432,
    "user": parsed.username,
    "password": parsed.password,
    "database": parsed.path.lstrip("/"),
}

# Create server instance
app = Server("database-server")

# Database connection pool
db_pool = None


async def init_db_pool():
    """Initialize database connection pool."""
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(
            **DB_CONFIG,
            min_size=1,
            max_size=10,
            command_timeout=30
        )
        logger.info("Database connection pool initialized")
    except Exception as e:
        logger.error(f"Failed to initialize database pool: {e}")
        raise


def is_safe_query(query: str) -> bool:
    """
    Validate that the query is safe (read-only).
    
    Args:
        query: SQL query to validate
        
    Returns:
        True if query is safe, False otherwise
    """
    # Remove comments
    query = re.sub(r'--.*$', '', query, flags=re.MULTILINE)
    query = re.sub(r'/\*.*?\*/', '', query, flags=re.DOTALL)
    
    # Check for write operations
    dangerous_keywords = [
        'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
        'TRUNCATE', 'REPLACE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE'
    ]
    
    query_upper = query.upper()
    for keyword in dangerous_keywords:
        if re.search(r'\b' + keyword + r'\b', query_upper):
            return False
    
    return True


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available database tools."""
    return [
        Tool(
            name="query",
            description="Execute a read-only SQL query on the database",
            inputSchema={
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "The SQL query to execute (must be a SELECT statement)"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of rows to return (default: 100, max: 1000)",
                        "default": 100
                    }
                },
                "required": ["sql"]
            }
        ),
        Tool(
            name="list_tables",
            description="List all tables in the database",
            inputSchema={
                "type": "object",
                "properties": {
                    "schema": {
                        "type": "string",
                        "description": "Filter by schema name (default: public)",
                        "default": "public"
                    }
                }
            }
        ),
        Tool(
            name="describe_table",
            description="Show the schema/structure of a specific table",
            inputSchema={
                "type": "object",
                "properties": {
                    "table": {
                        "type": "string",
                        "description": "Name of the table to describe"
                    },
                    "schema": {
                        "type": "string",
                        "description": "Schema name (default: public)",
                        "default": "public"
                    }
                },
                "required": ["table"]
            }
        ),
        Tool(
            name="get_table_stats",
            description="Get statistics about a table (row count, size, etc.)",
            inputSchema={
                "type": "object",
                "properties": {
                    "table": {
                        "type": "string",
                        "description": "Name of the table"
                    },
                    "schema": {
                        "type": "string",
                        "description": "Schema name (default: public)",
                        "default": "public"
                    }
                },
                "required": ["table"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """Execute a tool call."""
    logger.info(f"Tool called: {name}")
    logger.debug(f"Arguments: {arguments}")
    
    try:
        if name == "query":
            return await handle_query(arguments)
        elif name == "list_tables":
            return await handle_list_tables(arguments)
        elif name == "describe_table":
            return await handle_describe_table(arguments)
        elif name == "get_table_stats":
            return await handle_table_stats(arguments)
        else:
            raise ValueError(f"Unknown tool: {name}")
    except Exception as e:
        logger.error(f"Error executing tool {name}: {e}", exc_info=True)
        return [TextContent(
            type="text",
            text=f"Error: {str(e)}"
        )]


async def handle_query(arguments: dict) -> list[TextContent]:
    """Handle SQL query execution."""
    sql = arguments["sql"].strip()
    limit = min(arguments.get("limit", 100), 1000)
    
    # Validate query is read-only
    if not is_safe_query(sql):
        raise ValueError("Only SELECT queries are allowed")
    
    # Add LIMIT if not present
    if not re.search(r'\bLIMIT\b', sql, re.IGNORECASE):
        sql = f"{sql} LIMIT {limit}"
    
    async with db_pool.acquire() as conn:
        try:
            rows = await conn.fetch(sql)
            
            if not rows:
                return [TextContent(
                    type="text",
                    text="Query executed successfully. No rows returned."
                )]
            
            # Format results as table
            columns = list(rows[0].keys())
            result_lines = [
                "| " + " | ".join(columns) + " |",
                "|" + "|".join(["---" for _ in columns]) + "|"
            ]
            
            for row in rows:
                values = [str(row[col]) if row[col] is not None else "NULL" for col in columns]
                result_lines.append("| " + " | ".join(values) + " |")
            
            result_text = "\n".join(result_lines)
            result_text += f"\n\n**Rows returned**: {len(rows)}"
            
            return [TextContent(
                type="text",
                text=result_text
            )]
        except asyncpg.PostgresError as e:
            raise ValueError(f"Query error: {e}")


async def handle_list_tables(arguments: dict) -> list[TextContent]:
    """Handle listing database tables."""
    schema = arguments.get("schema", "public")
    
    query = """
        SELECT table_name, table_type
        FROM information_schema.tables
        WHERE table_schema = $1
        ORDER BY table_name
    """
    
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(query, schema)
        
        if not rows:
            return [TextContent(
                type="text",
                text=f"No tables found in schema '{schema}'"
            )]
        
        result_lines = [
            "| Table Name | Type |",
            "|------------|------|"
        ]
        
        for row in rows:
            result_lines.append(f"| {row['table_name']} | {row['table_type']} |")
        
        result_text = "\n".join(result_lines)
        result_text += f"\n\n**Total tables**: {len(rows)}"
        
        return [TextContent(
            type="text",
            text=result_text
        )]


async def handle_describe_table(arguments: dict) -> list[TextContent]:
    """Handle table schema description."""
    table = arguments["table"]
    schema = arguments.get("schema", "public")
    
    query = """
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position
    """
    
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(query, schema, table)
        
        if not rows:
            return [TextContent(
                type="text",
                text=f"Table '{schema}.{table}' not found"
            )]
        
        result_lines = [
            f"## Table: {schema}.{table}\n",
            "| Column | Type | Nullable | Default |",
            "|--------|------|----------|---------|"
        ]
        
        for row in rows:
            col_type = row['data_type']
            if row['character_maximum_length']:
                col_type += f"({row['character_maximum_length']})"
            
            nullable = "Yes" if row['is_nullable'] == 'YES' else "No"
            default = row['column_default'] or "-"
            
            result_lines.append(
                f"| {row['column_name']} | {col_type} | {nullable} | {default} |"
            )
        
        return [TextContent(
            type="text",
            text="\n".join(result_lines)
        )]


async def handle_table_stats(arguments: dict) -> list[TextContent]:
    """Handle table statistics retrieval."""
    table = arguments["table"]
    schema = arguments.get("schema", "public")
    
    # Get row count
    count_query = f'SELECT COUNT(*) FROM "{schema}"."{table}"'
    
    # Get table size
    size_query = """
        SELECT 
            pg_size_pretty(pg_total_relation_size($1)) as total_size,
            pg_size_pretty(pg_relation_size($1)) as table_size,
            pg_size_pretty(pg_indexes_size($1)) as indexes_size
    """
    
    async with db_pool.acquire() as conn:
        try:
            # Get row count
            count = await conn.fetchval(count_query)
            
            # Get sizes
            size_row = await conn.fetchrow(
                size_query,
                f"{schema}.{table}"
            )
            
            result = f"""## Table Statistics: {schema}.{table}

**Row Count**: {count:,}
**Total Size**: {size_row['total_size']}
**Table Size**: {size_row['table_size']}
**Indexes Size**: {size_row['indexes_size']}
"""
            
            return [TextContent(
                type="text",
                text=result
            )]
        except asyncpg.PostgresError as e:
            raise ValueError(f"Error getting table stats: {e}")


async def main():
    """Main entry point for the server."""
    # Initialize database connection pool
    await init_db_pool()
    
    try:
        async with stdio_server() as (read_stream, write_stream):
            logger.info("Database MCP Server starting...")
            await app.run(
                read_stream,
                write_stream,
                app.create_initialization_options()
            )
    finally:
        if db_pool:
            await db_pool.close()
            logger.info("Database connection pool closed")


if __name__ == "__main__":
    asyncio.run(main())
