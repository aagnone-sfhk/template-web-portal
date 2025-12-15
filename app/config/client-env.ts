import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_TITLE: z.string().min(1).default("AI Chat Assistant"),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1).default("Your intelligent AI assistant powered by Salesforce Einstein"),
  NEXT_PUBLIC_APP_INTRO_MESSAGE: z.string().min(1).default("Hello! I'm your AI assistant. How can I help you today?"),
  NEXT_PUBLIC_EVENT_HUB_URL: z.string().min(1).default("https://hub.herokuapps.ai"),
  NEXT_PUBLIC_LOGO: z.string().min(1).default("https://hub.herokuapps.ai/images/AmazonBubble.png"),
  NEXT_PUBLIC_AVATAR: z.string().min(1).default("/af.png"),
  NEXT_PUBLIC_LOGO_ALT: z.string().min(1).default("Admin Portal"),
  // Salesforce Org URL for direct record links (defaults to acme-v2 org)
  NEXT_PUBLIC_SF_ORG_URL: z.string().url().default("https://dbaliles-250405-464-demo.my.salesforce.com"),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

function validateClientEnv(): ClientEnv {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,
      NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      NEXT_PUBLIC_APP_INTRO_MESSAGE: process.env.NEXT_PUBLIC_APP_INTRO_MESSAGE,
      NEXT_PUBLIC_EVENT_HUB_URL: process.env.NEXT_PUBLIC_EVENT_HUB_URL,
      NEXT_PUBLIC_LOGO: process.env.NEXT_PUBLIC_LOGO,
      NEXT_PUBLIC_LOGO_ALT: process.env.NEXT_PUBLIC_LOGO_ALT,
      NEXT_PUBLIC_AVATAR: process.env.NEXT_PUBLIC_AVATAR,
      NEXT_PUBLIC_SF_ORG_URL: process.env.NEXT_PUBLIC_SF_ORG_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join(".")).join(", ");
      throw new Error(`❌ Invalid client environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// Re-export the client environment variables
export const clientEnv = validateClientEnv(); 