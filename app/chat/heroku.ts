'use server';

import 'server-only';
import axios from 'axios';
import { env } from 'app/config/env';
import { Message, Tool, McpServer } from './types';

export const getMcpServers = async (): Promise<McpServer[]> => {
  const { data } = await axios.get<McpServer[]>(`${env.INFERENCE_URL}/v1/mcp/servers`, {
    headers: {
      Authorization: `Bearer ${env.INFERENCE_KEY}`
    }
  });
  return data;
}

export const sendStreamingMessage = async (
  text: string,
  messages: Message[],
  tools: Tool[],
) => {
  const { data } = await axios({
    method: 'post',
    url: `${env.INFERENCE_URL}`,
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.INFERENCE_KEY}`
    },
    data: {
      model: env.INFERENCE_MODEL_ID,
      messages: [
        ...messages.map((message) => ({
          role: message.type === 'ai' ? 'assistant' : 'user',
          content: message.message
        })),
        {
          role: 'user',
          content: text
        }
      ],
      tools,
    },
    responseType: 'stream'
  });
  return data;
};
