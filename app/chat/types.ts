export type Message = {
  type: "ai" | "user";
  message: string;
  aiStatus?: string;
  isTyping?: boolean;
  timestamp: string;
  subtype?: "productBackfilled" | "chat";
  data?: {
    caseId?: string;
  };
};

export type Tool = {
  type: 'mcp' | 'heroku_tool';
  name: string;
  description: string;
  runtime_params: Record<string, any>;
}

export type McpServerTool = {
  name: string;
  namespaced_name: string;
  description: string;
}

export type McpServer = {
  id: string;
  app_id: string;
  tools: McpServerTool[];
  server_status: string;
  primitives_status: string;
  namespace: string;
}
