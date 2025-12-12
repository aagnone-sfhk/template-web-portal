import { ModelConfig } from './types/shared';

interface Config {
  system_prompt: string;
  models: {
    [key: string]: ModelConfig;
  };
  tools: {
    [key: string]: {
      type: string;
      name: string;
      runtime_params?: {
        target_app_name?: string;
        max_retries?: number;
      };
    };
  };
}

// Target app name for Heroku tools - uses current app or override from env
const targetAppName = process.env.HEROKU_APP_NAME || process.env.TARGET_APP_NAME || 'template-web-portal';

export const config: Config = {
  system_prompt:
    process.env.SYSTEM_PROMPT ||
    'You are a helpful assistant that can answer questions and help with tasks.',
  models: {
    'claude-3-7-sonnet': {
      INFERENCE_URL: process.env.INFERENCE_URL || 'https://us.inference.heroku.com',
      API_KEY: process.env.INFERENCE_KEY || 'inf-1234567890',
      MODEL_ID: process.env.INFERENCE_MODEL_ID || 'claude-3-7-sonnet',
    },
    'claude-4-sonnet': {
      INFERENCE_URL: process.env.INFERENCE_URL || 'https://us.inference.heroku.com',
      API_KEY: process.env.INFERENCE_KEY || 'inf-1234567890',
      MODEL_ID: process.env.INFERENCE_MODEL_ID || 'claude-4-5-sonnet',
    },
    'stable-image-ultra': {
      DIFFUSION_URL: process.env.DIFFUSION_URL || 'https://us.inference.heroku.com',
      API_KEY: process.env.DIFFUSION_KEY || 'inf-1234567890',
      MODEL_ID: 'stable-image-ultra',
    },
  },
  tools: {
    html_to_markdown: {
      type: 'heroku_tool',
      name: 'html_to_markdown',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    pdf_to_markdown: {
      type: 'heroku_tool',
      name: 'pdf_to_markdown',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    code_exec_python: {
      type: 'heroku_tool',
      name: 'code_exec_python',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    code_exec_ruby: {
      type: 'heroku_tool',
      name: 'code_exec_ruby',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    code_exec_node: {
      type: 'heroku_tool',
      name: 'code_exec_node',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    code_exec_go: {
      type: 'heroku_tool',
      name: 'code_exec_go',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    postgres_get_schema: {
      type: 'heroku_tool',
      name: 'postgres_get_schema',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
    postgres_run_query: {
      type: 'heroku_tool',
      name: 'postgres_run_query',
      runtime_params: {
        target_app_name: targetAppName,
      },
    },
  },
};

export const getModels = () => {
  return Object.keys(config.models);
};

export const getTool = (tool: string) => {
  return config.tools[tool];
};

export const getModel = (model: string) => {
  return config.models[model];
};
