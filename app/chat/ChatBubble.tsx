"use client";
import React, { useState, useEffect } from "react";
import ChatContainer from "./ChatContainer";
import { useChat } from "./ChatContext";
import AgentforceLogo from "@/components/AgentforceLogo";
import HerokuIcon from "@/components/HerokuIcon";

interface ChatBubbleProps {
  welcomeMessage: string;
  agentId?: string;
  agentName?: string;
}

export default function ChatBubble({
  welcomeMessage,
  agentName,
}: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const { isOpen, hasNotification, openChat, closeChat } = useChat();

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  // Reset expanded state when chat is closed
  const handleClose = () => {
    setIsExpanded(false);
    // Might be a bug in AF around this. Use with caution.
    // endSession();
    closeChat();
  };

  const displayName = agentName || "Agentforce";

  return (
    <>
      {!isOpen ? (
        // Chat Bubble - Only show when chat is closed
        <div className="fixed bottom-4 right-4 z-[100]">
          <div className="relative">
            <button
              onClick={openChat}
              className="bg-white rounded-full shadow-lg hover:shadow-xl w-14 h-14 flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <AgentforceLogo size="medium" alt={`Chat with ${displayName}`} />
            </button>
            {hasNotification && (
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-sm animate-pulse"></div>
            )}
          </div>
        </div>
      ) : (
        // Chat Interface - Single component with responsive behavior
        <div
          className={`
          fixed z-50 inset-0
          ${
            !isExpanded
              ? "md:w-1/3 md:inset-auto md:top-auto md:right-4 md:bottom-4 md:left-auto md:z-[100]"
              : "md:z-[200]"
          }
        `}
        >
          {/* Backdrop - only for desktop expanded */}
          {isExpanded && (
            <div 
              className="hidden md:block absolute inset-0 bg-black/20 backdrop-blur-sm cursor-pointer" 
              onClick={() => setIsExpanded(false)}
            />
          )}

          <div
            className={`
            bg-white flex flex-col shadow-2xl
            h-[100dvh] w-full
            md:h-auto md:w-auto
            ${
              isExpanded
                ? "md:max-w-4xl md:mx-auto md:rounded-xl md:relative md:top-1/2 md:-translate-y-1/2"
                : "md:rounded-xl"
            }
          `}
            style={viewportHeight > 0 ? {
              height: window.innerWidth >= 768 ? (
                isExpanded 
                  ? `${Math.min(viewportHeight * 0.75, viewportHeight - 32)}px`
                  : `${Math.min(viewportHeight * 0.6, viewportHeight - 32)}px`
              ) : '100dvh',
              maxHeight: window.innerWidth >= 768 ? `${viewportHeight - 32}px` : '100dvh'
            } : {}}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-white/95 backdrop-blur-sm md:bg-white md:backdrop-blur-none md:rounded-t-xl">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <HerokuIcon width={24} height={24} alt={displayName} />
                <div className="min-w-0 flex-1">
                  <h1 className="text-gray-900 truncate block text-xl font-medium">
                    {displayName}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Expand button - desktop only */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:flex text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close chat"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <ChatContainer
                welcomeMessage={welcomeMessage}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 