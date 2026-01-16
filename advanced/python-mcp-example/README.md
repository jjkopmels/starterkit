# Python MCP Server Example

This is a complete example of a Python-based MCP server that connects to a PostgreSQL database.

## Features

- Database connection management
- Execute read-only SQL queries
- List database tables and schemas
- Resource endpoints for common queries
- Error handling and logging
- Configuration via environment variables

## Installation

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Configuration

Set the following environment variables:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
export LOG_LEVEL="INFO"  # Optional: DEBUG, INFO, WARNING, ERROR
```

## Usage

### Run Locally

```bash
python server.py
```

### Configure in VS Code

Add to `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "database": {
      "command": "python",
      "args": ["path/to/server.py"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
      }
    }
  }
}
```

## Available Tools

### query
Execute a read-only SQL query.

**Example**:
```
@database query SELECT * FROM users LIMIT 10
```

### list_tables
List all tables in the database.

**Example**:
```
@database list tables
```

### describe_table
Show the schema of a specific table.

**Example**:
```
@database describe table users
```

## Security

- Only SELECT queries are allowed
- Input is sanitized to prevent SQL injection
- Connection uses SSL by default
- Credentials never appear in logs or responses

## Testing

```bash
# Run unit tests
pytest tests/

# Run with coverage
pytest --cov=server tests/
```

## Troubleshooting

**Issue**: "Could not connect to database"
- Verify DATABASE_URL is correctly set
- Check database is running and accessible
- Verify firewall rules allow connection

**Issue**: "Permission denied"
- Ensure database user has SELECT permissions
- Check table ownership and grants
