import { z } from "zod";

const envSchema = z.object({
  // Inference Configuration (for AI Chat)
  INFERENCE_URL: z.string().url(),
  INFERENCE_KEY: z.string().min(1),
  INFERENCE_MODEL_ID: z.string().min(1),
  
  // Salesforce AgentForce Configuration (optional)
  SF_MY_DOMAIN_URL: z.string().url().optional(),
  SF_CONSUMER_KEY: z.string().min(1).optional(),
  SF_CONSUMER_SECRET: z.string().min(1).optional(),
  SF_AGENT_ID: z.string().min(1).optional(),
  
  // UI Configuration (shared between client and server)
  NEXT_PUBLIC_APP_TITLE: z.string().min(1).default("Admin Portal"),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1).default("Your intelligent AI assistant"),
  NEXT_PUBLIC_APP_INTRO_MESSAGE: z.string().min(1).default("Hello! I'm your AI assistant. How can I help you today?"),
  NEXT_PUBLIC_EVENT_HUB_URL: z.string().min(1).default("https://hub.herokuapps.ai"),
  NEXT_PUBLIC_LOGO: z.string().min(1).default("/af.png"),
  NEXT_PUBLIC_AVATAR: z.string().min(1).default("/af.png"),
  NEXT_PUBLIC_LOGO_ALT: z.string().min(1).default("Admin Portal"),
  
  // Configurable External Links (optional)
  NEXT_PUBLIC_EXTERNAL_LINK_1_URL: z.string().url().optional(),
  NEXT_PUBLIC_EXTERNAL_LINK_1_LABEL: z.string().optional(),
  NEXT_PUBLIC_EXTERNAL_LINK_2_URL: z.string().url().optional(),
  NEXT_PUBLIC_EXTERNAL_LINK_2_LABEL: z.string().optional(),
  NEXT_PUBLIC_EXTERNAL_LINK_3_URL: z.string().url().optional(),
  NEXT_PUBLIC_EXTERNAL_LINK_3_LABEL: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse({
      INFERENCE_URL: process.env.INFERENCE_URL,
      INFERENCE_KEY: process.env.INFERENCE_KEY,
      INFERENCE_MODEL_ID: process.env.INFERENCE_MODEL_ID,
      SF_MY_DOMAIN_URL: process.env.SF_MY_DOMAIN_URL,
      SF_CONSUMER_KEY: process.env.SF_CONSUMER_KEY,
      SF_CONSUMER_SECRET: process.env.SF_CONSUMER_SECRET,
      SF_AGENT_ID: process.env.SF_AGENT_ID,
      NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
      NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      NEXT_PUBLIC_APP_INTRO_MESSAGE: process.env.NEXT_PUBLIC_APP_INTRO_MESSAGE,
      NEXT_PUBLIC_EVENT_HUB_URL: process.env.NEXT_PUBLIC_EVENT_HUB_URL,
      NEXT_PUBLIC_LOGO: process.env.NEXT_PUBLIC_LOGO,
      NEXT_PUBLIC_LOGO_ALT: process.env.NEXT_PUBLIC_LOGO_ALT,
      NEXT_PUBLIC_AVATAR: process.env.NEXT_PUBLIC_AVATAR,
      NEXT_PUBLIC_EXTERNAL_LINK_1_URL: process.env.NEXT_PUBLIC_EXTERNAL_LINK_1_URL,
      NEXT_PUBLIC_EXTERNAL_LINK_1_LABEL: process.env.NEXT_PUBLIC_EXTERNAL_LINK_1_LABEL,
      NEXT_PUBLIC_EXTERNAL_LINK_2_URL: process.env.NEXT_PUBLIC_EXTERNAL_LINK_2_URL,
      NEXT_PUBLIC_EXTERNAL_LINK_2_LABEL: process.env.NEXT_PUBLIC_EXTERNAL_LINK_2_LABEL,
      NEXT_PUBLIC_EXTERNAL_LINK_3_URL: process.env.NEXT_PUBLIC_EXTERNAL_LINK_3_URL,
      NEXT_PUBLIC_EXTERNAL_LINK_3_LABEL: process.env.NEXT_PUBLIC_EXTERNAL_LINK_3_LABEL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join(".")).join(", ");
      throw new Error(`❌ Invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

export const env = validateEnv();
