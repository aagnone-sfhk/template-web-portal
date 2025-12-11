'use client';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { PaperAirplaneIcon, StopIcon, TrashIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import { RiAiGenerate } from 'react-icons/ri';
import { LoadingDots } from '@/components/ui/LoadingDots';
import Image from 'next/image';
import { AgentToggle } from '@/components/ui/AgentToggle';
import { HEROKU_TOOLS, AGENT_PRESETS, type AgentPreset } from '@/constants/agents';
import { useCustomChat } from '@/hooks/useCustomChat';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import type {
  ToolType,
  ModelType,
  Message,
  ImageGenerationParams,
  Tool
} from '@/types/chat';
import type { McpServer } from '@/app/chat/types';
import { CollapsibleReasoning } from '@/components/ui/CollapsibleReasoning';
import { CollapsibleToolExecution } from '@/components/ui/CollapsibleToolExecution';
import { markdownComponents } from '@/constants/markdownComponents';

const MODELS: { id: ModelType; name: string }[] = [
  { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
  { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet' },
  { id: 'stable-image-ultra', name: 'Stable Image Ultra' }
];

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape HD (16:9)' },
  { value: '21:9', label: 'Ultrawide (21:9)' },
  { value: '9:16', label: 'Portrait HD (9:16)' },
  { value: '9:21', label: 'Portrait Ultrawide (9:21)' },
  { value: '3:2', label: 'Classic Photo (3:2)' },
  { value: '2:3', label: 'Portrait Photo (2:3)' },
  { value: '4:5', label: 'Portrait Social (4:5)' },
  { value: '5:4', label: 'Classic Screen (5:4)' }
];

const Chat: React.FC = () => {
  const [selectedModel, setSelectedModel] =
    useState<ModelType>('claude-4-sonnet');
  const [useReasoning, setUseReasoning] = useState(false);
  const [selectedTools, setSelectedTools] = useState<ToolType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mcpServers, setMcpServers] = useState<McpServer[]>([]);
  const [mcpLoading, setMcpLoading] = useState(true);

  // Image generation state
  const [seed, setSeed] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [negativePrompt, setNegativePrompt] = useState('');

  // Fetch MCP servers on component mount
  useEffect(() => {
    const fetchMcpServers = async () => {
      try {
        const response = await fetch('/api/mcp-servers');
        if (response.ok) {
          const servers = await response.json();
          setMcpServers(servers);
        }
      } catch (error) {
        console.error('Failed to fetch MCP servers:', error);
      } finally {
        setMcpLoading(false);
      }
    };

    fetchMcpServers();
  }, []);

  // Transform MCP tools to Tool format
  const mcpTools: Tool[] = mcpServers.flatMap((server) =>
    server.tools.map((tool) => ({
      id: tool.namespaced_name as ToolType,
      name: tool.name,
      icon: () => <Image src="/mcp.png" alt="MCP" width={16} height={16} />,
      type: 'mcp' as const,
      description: tool.description
    }))
  );

  // Combine constant tools with MCP tools
  const allTools = [...HEROKU_TOOLS, ...mcpTools];

  // Create dynamic agent presets with MCP tools
  const dynamicAgentPresets: AgentPreset[] = AGENT_PRESETS.map(preset => {
    if (preset.id === 'heroku-admin') {
      return {
        ...preset,
        tools: mcpTools.map(tool => tool.id)
      };
    }
    if (preset.id === 'full-stack') {
      return {
        ...preset,
        tools: [...preset.tools, ...mcpTools.map(tool => tool.id)]
      };
    }
    return preset;
  });

  const handleAgentPresetSelect = (preset: AgentPreset) => {
    setSelectedTools(preset.tools);
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error: chatError,
    status: chatStatus,
    stop,
    reload,
    setMessages,
    setInput
  } = useCustomChat({
    model: selectedModel,
    reasoning: useReasoning,
    tools: selectedTools
  });

  const {
    generateImage,
    status: imageStatus,
    error: imageError
  } = useImageGeneration({
    onSuccess: (newMessages) => {
      setMessages((prev) => [...prev, ...newMessages]);
      setInput('');
    }
  });

  useEffect(() => {
    if (selectedModel === 'claude-3-7-sonnet') {
      setUseReasoning(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedTools.length > 0) {
      setUseReasoning(false);
    }
  }, [selectedTools]);

  useEffect(() => {
    setIsLoading(chatStatus === 'loading' || imageStatus === 'loading');
  }, [chatStatus, imageStatus]);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleClear = () => {
    setMessages([]);
  };

  const handleRetry = () => {
    if (chatStatus === 'error') {
      void reload();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;
    setIsLoading(true);

    try {
      if (selectedModel === 'stable-image-ultra') {
        const params: ImageGenerationParams = {
          model: 'stable-image-ultra',
          prompt: input,
          aspect_ratio: aspectRatio,
          ...(seed ? { seed } : {}),
          ...(negativePrompt ? { negative_prompt: negativePrompt } : {})
        };
        await generateImage(params);
      } else {
        await handleSubmit();
      }
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const error = chatError || imageError;

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div
        className={clsx(
          'w-full transition-all duration-500 ease-in-out',
          messages.length === 0 ? 'max-w-3xl h-[min(400px,100%)]' : 'max-w-5xl h-full'
        )}
      >
        <div className="bg-white rounded-xl shadow-lg w-full h-full flex flex-col overflow-hidden">
          <div
            className={clsx(
              'flex-1 p-6 overflow-y-auto space-y-6 min-h-0',
              messages.length === 0 && 'flex items-center'
            )}
          >
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 w-full flex items-center justify-center gap-2">
                <span>What can I help you with?</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "Prepping to reach out this vendor: Bob's Flip Flop Shop. Pull the vendor's website info to see the latest and verify if I can contact them at 678-525-2059."
                    );
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy sample prompt"
                >
                  <ClipboardIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {messages.map((message: Message) => (
              <div
                key={`${message.role}-${message.content.substring(0, 32)}`}
                className={clsx('flex', {
                  'justify-end': message.role === 'user',
                  'justify-start':
                    message.role === 'assistant' || message.role === 'agent'
                })}
              >
                {message.role === 'assistant' ? (
                  <div className="flex flex-col max-w-[90%] text-base">
                    {message.reasoning && (
                      <CollapsibleReasoning
                        thinking={message.reasoning.thinking}
                        expanded={true}
                      />
                    )}
                    <div className="text-gray-800 bg-white">
                      {/[*#[\]_`]/.test(message.content) ||
                      message.content.includes('\n\n') ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={markdownComponents}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      )}
                      {message.type === 'image' && message.image_url && (
                        <img
                          src={message.image_url}
                          alt="Generated"
                          className="mt-4 rounded-lg shadow-lg max-w-full h-auto"
                        />
                      )}
                    </div>
                  </div>
                ) : message.role === 'agent' ? (
                  <div className="flex flex-col max-w-[90%] text-base">
                    <div className="flex items-center gap-2">
                      <RiAiGenerate className="w-4 h-4" />
                      <div className={clsx('text-gray-600 italic')}>
                        {/[*#[\]_`]/.test(message.content) ||
                        message.content.includes('\n\n') ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={markdownComponents}
                          >
                            {message.content}
                          </ReactMarkdown>
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        )}
                      </div>
                    </div>
                    {message.tool_calls && message.tool_calls.length > 0 && (
                      <CollapsibleToolExecution
                        toolCalls={message.tool_calls}
                        expanded={false}
                      />
                    )}
                  </div>
                ) : (
                  <div className="chat-message max-w-[90%] px-4 py-3 rounded-2xl bg-heroku-purple-30 text-white">
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                  <span>Error: {error.message}</span>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-sm underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <LoadingDots className="py-1" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t bg-white p-4 space-y-4">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={messages.length === 0 || isLoading}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder={
                    selectedModel === 'stable-image-ultra'
                      ? 'Describe the image you want to generate...'
                      : 'Ask me anything...'
                  }
                  className="flex-1 rounded-xl border-0 bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-heroku-purple-30 disabled:bg-gray-50 disabled:text-gray-500"
                  disabled={isLoading}
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="rounded-xl bg-gray-100 p-3 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-heroku-purple-30"
                    title="Stop generating"
                  >
                    <StopIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-xl bg-heroku-purple-30 p-3 text-white hover:bg-heroku-purple-20 focus:outline-none focus:ring-2 focus:ring-heroku-purple-30 disabled:opacity-50"
                    title="Submit your question"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
            <div className="flex items-center gap-4 justify-between text-xs text-gray-500">
              <div className="flex flex-col gap-2">
                {selectedModel !== 'stable-image-ultra' && (
                  <div className="flex flex-col gap-2 items-end">
                    {mcpLoading ? (
                      <div className="text-xs text-gray-400">
                        Loading tools...
                      </div>
                    ) : (
                      <>
                        {/* Agent Presets */}
                                                  <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400 font-medium">
                              Agent Presets {selectedTools.length > 0 && (
                                <span className="text-heroku-purple-30 font-semibold">
                                  ({selectedTools.length} selected)
                                </span>
                              )}
                            </div>
                            {selectedTools.length > 0 && (
                              <button
                                onClick={() => setSelectedTools([])}
                                disabled={isLoading}
                                className="text-xs text-gray-500 hover:text-gray-700 underline disabled:opacity-50 ml-2"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        <div className="flex flex-wrap gap-2 justify-end mb-4">
                          {dynamicAgentPresets.map((preset) => {
                            const IconComponent = preset.icon;
                            const isActive = preset.tools.length > 0 && 
                              preset.tools.every(tool => selectedTools.includes(tool)) &&
                              selectedTools.length === preset.tools.length;
                            
                            return (
                              <button
                                key={preset.id}
                                onClick={() => handleAgentPresetSelect(preset)}
                                disabled={isLoading || (preset.id === 'heroku-admin' && mcpTools.length === 0)}
                                className={`
                                  flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium
                                  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                  ${isActive 
                                    ? preset.color.replace('hover:', '').replace('hover:bg-', 'bg-')
                                    : `bg-white text-gray-600 border-gray-200 ${preset.color}`
                                  }
                                `}
                                title={preset.description}
                              >
                                <IconComponent className="w-4 h-4" />
                                {preset.name}
                              </button>
                            );
                          })}
                        </div>

                        {/* Built-in Heroku Tools */}
                        {HEROKU_TOOLS.length > 0 && (
                          <>
                            <div className="text-xs text-gray-400 font-medium">
                              Heroku Tools
                            </div>
                            <div className="flex flex-wrap gap-1.5 justify-end">
                              {HEROKU_TOOLS.map((tool) => (
                                <AgentToggle
                                  key={tool.id}
                                  agent={tool}
                                  isSelected={selectedTools.includes(tool.id)}
                                  onToggle={() => {
                                    setSelectedTools((prev) =>
                                      prev.includes(tool.id)
                                        ? prev.filter((id) => id !== tool.id)
                                        : [...prev, tool.id]
                                    );
                                  }}
                                  disabled={isLoading}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        {/* Dynamic MCP Server Tools */}
                        {mcpTools.length > 0 && (
                          <>
                            <div className="text-xs text-gray-400 font-medium">
                              MCP Server Tools ({mcpTools.length})
                            </div>
                            <div className="flex flex-wrap gap-1.5 justify-end">
                              {mcpTools.map((tool) => (
                                <AgentToggle
                                  key={tool.id}
                                  agent={tool}
                                  isSelected={selectedTools.includes(tool.id)}
                                  onToggle={() => {
                                    setSelectedTools((prev) =>
                                      prev.includes(tool.id)
                                        ? prev.filter((id) => id !== tool.id)
                                        : [...prev, tool.id]
                                    );
                                  }}
                                  disabled={isLoading}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 justify-end">
                  {selectedModel !== 'stable-image-ultra' && (
                    <label className="inline-flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useReasoning}
                          onChange={(e) => setUseReasoning(e.target.checked)}
                          disabled={
                            isLoading ||
                            selectedModel !== 'claude-3-7-sonnet' ||
                            selectedTools.length > 0
                          }
                        />
                        <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-heroku-purple-30"></div>
                      </div>
                      <span className="ml-2 text-xs font-medium">
                        Reasoning
                      </span>
                    </label>
                  )}
                  {selectedModel === 'stable-image-ultra' && (
                    <>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="text-xs rounded-md border-gray-300 shadow-sm focus:border-heroku-purple-30 focus:ring-heroku-purple-30 bg-transparent py-1 pl-2 pr-8"
                      >
                        {ASPECT_RATIOS.map((ratio) => (
                          <option key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Negative prompt"
                        className="text-xs rounded-md border-gray-300 shadow-sm focus:border-heroku-purple-30 focus:ring-heroku-purple-30 bg-transparent py-1 pl-2 pr-2 w-48"
                      />
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value, 10))}
                        placeholder="Seed"
                        className="text-xs rounded-md border-gray-300 shadow-sm focus:border-heroku-purple-30 focus:ring-heroku-purple-30 bg-transparent py-1 pl-2 pr-2 w-24"
                      />
                    </>
                  )}
                  <select
                    value={selectedModel}
                    onChange={(e) =>
                      setSelectedModel(e.target.value as ModelType)
                    }
                    className="text-xs rounded-md border-gray-300 shadow-sm focus:border-heroku-purple-30 focus:ring-heroku-purple-30 bg-transparent py-1 pl-2 pr-8"
                    disabled={isLoading}
                  >
                    {MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
