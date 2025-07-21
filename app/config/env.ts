import { z } from "zod";

const envSchema = z.object({
  // Salesforce Configuration
  SF_MY_DOMAIN_URL: z.string().url(),
  SF_CONSUMER_KEY: z.string().min(1),
  SF_CONSUMER_SECRET: z.string().min(1),
  SF_AGENT_ID: z.string().min(1),
  INFERENCE_URL: z.string().url(),
  INFERENCE_KEY: z.string().min(1),
  INFERENCE_MODEL_ID: z.string().min(1),
  
  // UI Configuration (shared between client and server)
  NEXT_PUBLIC_APP_TITLE: z.string().min(1).default("Next Gen Portal"),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1).default("Your intelligent AI assistant powered by Salesforce Einstein"),
  NEXT_PUBLIC_APP_INTRO_MESSAGE: z.string().min(1).default("Hello! I'm your AI assistant. How can I help you today?"),
  NEXT_PUBLIC_EVENT_HUB_URL: z.string().min(1).default("https://hub.herokuapps.ai"),
  NEXT_PUBLIC_LOGO: z.string().min(1).default("https://hub.herokuapps.ai/images/AmazonBubble.png"),
  NEXT_PUBLIC_AVATAR: z.string().min(1).default("/constellation.png"),
  NEXT_PUBLIC_LOGO_ALT: z.string().min(1).default("Amazon"),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse({
      SF_MY_DOMAIN_URL: process.env.SF_MY_DOMAIN_URL,
      SF_CONSUMER_KEY: process.env.SF_CONSUMER_KEY,
      SF_CONSUMER_SECRET: process.env.SF_CONSUMER_SECRET,
      SF_AGENT_ID: process.env.SF_AGENT_ID,
      INFERENCE_URL: process.env.INFERENCE_URL,
      INFERENCE_KEY: process.env.INFERENCE_KEY,
      INFERENCE_MODEL_ID: process.env.INFERENCE_MODEL_ID,
      NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
      NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      NEXT_PUBLIC_APP_INTRO_MESSAGE: process.env.NEXT_PUBLIC_APP_INTRO_MESSAGE,
      NEXT_PUBLIC_EVENT_HUB_URL: process.env.NEXT_PUBLIC_EVENT_HUB_URL,
      NEXT_PUBLIC_LOGO: process.env.NEXT_PUBLIC_LOGO,
      NEXT_PUBLIC_LOGO_ALT: process.env.NEXT_PUBLIC_LOGO_ALT,
      NEXT_PUBLIC_AVATAR: process.env.NEXT_PUBLIC_AVATAR,
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