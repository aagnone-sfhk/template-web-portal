# Add Heroku Postgres as MCP Server

Fetches `DATABASE_URL` from the specified Heroku app
Adds a postgres-mcp server configuration to `.cursor/mcp.json` using restricted access mode for safety
Script to run: `./scripts/add-heroku-postgres-mcp.sh <app-name> [server-name]`

Use the git remote to identify the Heroku app name.

## Usage Examples

```bash
# Add MCP server from app "my-app" (creates server named "postgres-my-app")
./scripts/add-heroku-postgres-mcp.sh my-app

# Add with custom server name
./scripts/add-heroku-postgres-mcp.sh my-app my-custom-db
```

## Requirements

- Heroku CLI installed and logged in
- `jq` installed (`brew install jq`)
- Access to the target Heroku app

## Configuration Location

Project-level: `.cursor/mcp.json` (created if missing)
Server uses `uvx postgres-mcp --access-mode=restricted`