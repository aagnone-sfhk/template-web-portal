import { SiRuby, SiGo, SiNodedotjs, SiPython, SiHtml5, SiAdobeacrobatreader } from 'react-icons/si';
import { CodeBracketIcon, DocumentTextIcon, CogIcon, ServerIcon } from '@heroicons/react/24/outline';
import type { Tool, ToolType } from '@/types/chat';

export const HEROKU_TOOLS: Tool[] = [
  { id: 'html_to_markdown', name: 'HTML to Markdown', icon: SiHtml5, type: 'heroku' },
  { id: 'pdf_to_markdown', name: 'PDF to Markdown', icon: SiAdobeacrobatreader, type: 'heroku' },
  { id: 'code_exec_python', name: 'Python', icon: SiPython, type: 'heroku' },
  { id: 'code_exec_node', name: 'Node.js', icon: SiNodedotjs, type: 'heroku' },
  { id: 'code_exec_ruby', name: 'Ruby', icon: SiRuby, type: 'heroku' },
  { id: 'code_exec_go', name: 'Go', icon: SiGo, type: 'heroku' },
];

export interface AgentPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  tools: ToolType[];
  color: string;
}

export const AGENT_PRESETS: AgentPreset[] = [
  {
    id: 'code-exec',
    name: 'Code Executor',
    description: 'Code execution across multiple languages',
    icon: CodeBracketIcon,
    tools: ['code_exec_python', 'code_exec_node', 'code_exec_ruby', 'code_exec_go'],
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
  },
  {
    id: 'content-processor',
    name: 'Content Processor',
    description: 'Convert and process documents',
    icon: DocumentTextIcon,
    tools: ['html_to_markdown', 'pdf_to_markdown'],
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
  },
  {
    id: 'heroku-admin',
    name: 'MCP Only',
    description: 'MCP server tools only',
    icon: ServerIcon,
    tools: [], // Will be populated with MCP tools dynamically
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
  },
  {
    id: 'full-stack',
    name: 'Admin',
    description: 'All available tools for comprehensive tasks',
    icon: CogIcon,
    tools: ['html_to_markdown', 'pdf_to_markdown', 'code_exec_python', 'code_exec_node', 'code_exec_ruby', 'code_exec_go'],
    color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
  }
];
