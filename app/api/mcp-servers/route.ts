import { NextRequest, NextResponse } from "next/server";
import { getMcpServers } from "app/chat/heroku";

export async function GET(req: NextRequest) {
  try {
    const mcpServers = await getMcpServers();
    
    return NextResponse.json(mcpServers, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch MCP servers' },
      { status: 500 }
    );
  }
} 