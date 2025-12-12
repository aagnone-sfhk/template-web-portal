#!/bin/bash
#
# Add a Heroku Postgres database as an MCP server configuration
# Usage: ./scripts/add-heroku-postgres-mcp.sh <app-name> [server-name]
#
# This script:
#   1. Fetches DATABASE_URL from the specified Heroku app
#   2. Adds it to .cursor/mcp.json in the project (or creates the file)
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for required argument
if [ -z "$1" ]; then
    echo -e "${RED}Error: Heroku app name is required${NC}"
    echo ""
    echo "Usage: $0 <app-name> [server-name]"
    echo ""
    echo "Arguments:"
    echo "  app-name     Name of the Heroku app (required)"
    echo "  server-name  Name for the MCP server (optional, defaults to 'postgres-<app-name>')"
    exit 1
fi

APP_NAME="$1"
SERVER_NAME="${2:-postgres-$APP_NAME}"

# Check if heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${RED}Error: Heroku CLI is not installed${NC}"
    echo "Install it with: brew tap heroku/brew && brew install heroku"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed${NC}"
    echo "Install it with: brew install jq"
    exit 1
fi

echo -e "${YELLOW}Fetching DATABASE_URL from Heroku app: ${APP_NAME}${NC}"

# Get DATABASE_URL from Heroku
DATABASE_URL=$(heroku config:get DATABASE_URL --app "$APP_NAME" 2>/dev/null)

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: Could not fetch DATABASE_URL from app '${APP_NAME}'${NC}"
    echo "Make sure:"
    echo "  1. The app exists and you have access to it"
    echo "  2. The app has a Postgres addon attached"
    echo "  3. You are logged in to Heroku CLI (run: heroku login)"
    exit 1
fi

echo -e "${GREEN}✓ Retrieved DATABASE_URL${NC}"

# Project-level MCP config
MCP_CONFIG_FILE=".cursor/mcp.json"

# Create .cursor directory if it doesn't exist
mkdir -p .cursor

# Create or update mcp.json
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo -e "${YELLOW}Updating existing ${MCP_CONFIG_FILE}${NC}"
    
    # Check if server already exists
    if jq -e ".mcpServers[\"$SERVER_NAME\"]" "$MCP_CONFIG_FILE" > /dev/null 2>&1; then
        echo -e "${YELLOW}Server '${SERVER_NAME}' already exists, updating...${NC}"
    fi
    
    # Add/update the server configuration
    jq --arg name "$SERVER_NAME" \
       --arg db_url "$DATABASE_URL" \
       '.mcpServers[$name] = {
           "command": "uvx",
           "args": ["postgres-mcp", "--access-mode=restricted"],
           "env": {
               "DATABASE_URI": $db_url
           }
       }' "$MCP_CONFIG_FILE" > "${MCP_CONFIG_FILE}.tmp" && mv "${MCP_CONFIG_FILE}.tmp" "$MCP_CONFIG_FILE"
else
    echo -e "${YELLOW}Creating new ${MCP_CONFIG_FILE}${NC}"
    
    # Create new mcp.json with the server configuration
    jq -n --arg name "$SERVER_NAME" \
          --arg db_url "$DATABASE_URL" \
          '{
               "mcpServers": {
                   ($name): {
                       "command": "uvx",
                       "args": ["postgres-mcp", "--access-mode=restricted"],
                       "env": {
                           "DATABASE_URI": $db_url
                       }
                   }
               }
           }' > "$MCP_CONFIG_FILE"
fi

echo -e "${GREEN}✓ MCP server '${SERVER_NAME}' added to ${MCP_CONFIG_FILE}${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Reload Cursor window (Cmd+Shift+P → 'Developer: Reload Window')"
echo "  2. The MCP server should appear in your MCP panel"
echo ""
echo -e "${GREEN}Done!${NC}"

