import { NextRequest, NextResponse } from "next/server";
import { getMcpServers } from "app/chat/heroku";
import { config, getModel, getTool } from '../config';
import { ChatRequest, ChatRequestBody, ErrorResponse } from '../types/chat';

export async function GET(req: NextRequest) {
  try {
    const servers = await getMcpServers();
    return NextResponse.json(servers);
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP servers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, model, tools, reasoning } = body;

    const modelConfig = getModel(model);

    if (!modelConfig) {
      return NextResponse.json(
        { error: 'Invalid model' },
        { status: 400 }
      );
    }

    const inferenceUrl = `${modelConfig.INFERENCE_URL}/v1/chat/completions`;
    const agentsUrl = `${modelConfig.INFERENCE_URL}/v1/agents/heroku`;
    const systemPrompt = config.system_prompt;
    const hasTools = tools && tools.length > 0;

    // Use the actual model ID from config (e.g., 'claude-4-5-sonnet' from INFERENCE_MODEL_ID)
    const actualModelId = modelConfig.MODEL_ID || model;
    
    const requestBody: ChatRequestBody = {
      model: actualModelId,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    };

    if (hasTools) {
      const requestTools = [];

      // Process all tools - both Heroku and MCP
      for (const tool of tools) {
        // Check if this is a known Heroku tool by looking it up in config
        const herokuTool = getTool(tool.name);
        
        if (herokuTool) {
          // Known Heroku tool - use the config definition
          requestTools.push({
            type: herokuTool.type,
            name: herokuTool.name,
            runtime_params: herokuTool.runtime_params || {},
          });
        } else if (tool.type === 'mcp') {
          // Explicitly marked as MCP tool
          requestTools.push({
            type: 'mcp',
            name: tool.name,
            description: tool.description,
          });
        } else {
          // Unknown tool type - log warning and skip
          console.warn(`Unknown tool type for tool: ${tool.name}. Skipping.`);
        }
      }

      requestBody.tools = requestTools;
    } else {
      requestBody.stream = true;
      if (model === 'claude-4-sonnet' && reasoning) {
        requestBody.extended_thinking = {
          enabled: true,
          budget_tokens: 2000,
          include_reasoning: true,
        };
      }
    }

    const response = await fetch(hasTools ? agentsUrl : inferenceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${modelConfig.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from model:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to fetch from model',
          details: errorData.error?.message || 'Unknown error',
        },
        { status: response.status }
      );
    }

    if (!response.body) {
      return NextResponse.json(
        { error: 'No response body received' },
        { status: 500 }
      );
    }

    // All responses from the agents/inference endpoints are streaming
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
} 