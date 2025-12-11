import { env } from "app/config/env";

export interface AgentForceConfig {
  baseUrl: string;
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  agentId: string;
  isConfigured: boolean;
}

class AgentForceConfiguration implements AgentForceConfig {
  readonly baseUrl: string;
  readonly credentials: {
    clientId: string;
    clientSecret: string;
  };
  readonly agentId: string;
  readonly isConfigured: boolean;

  constructor() {
    // Check if Salesforce AgentForce is configured
    this.isConfigured = !!(
      env.SF_MY_DOMAIN_URL &&
      env.SF_CONSUMER_KEY &&
      env.SF_CONSUMER_SECRET &&
      env.SF_AGENT_ID
    );

    this.baseUrl = env.SF_MY_DOMAIN_URL?.replace("https://", "") ?? "";
    this.credentials = {
      clientId: env.SF_CONSUMER_KEY ?? "",
      clientSecret: env.SF_CONSUMER_SECRET ?? "",
    };
    this.agentId = env.SF_AGENT_ID ?? "";
  }

  getAuthEndpoint(): string {
    return `https://${this.baseUrl}/services/oauth2/token`;
  }

  getApiEndpoint(path: string): string {
    return `https://${this.baseUrl}${path}`;
  }

  getAgentSessionEndpoint(): string {
    return `/einstein/ai-agent/v1/agents/${this.agentId}/sessions`;
  }

  getSessionEndpoint(sessionId: string): string {
    return `/einstein/ai-agent/v1/sessions/${sessionId}`;
  }

  getStreamingEndpoint(sessionId: string): string {
    return `/einstein/ai-agent/v1/sessions/${sessionId}/messages/stream`;
  }
}

export const agentConfig = new AgentForceConfiguration();
