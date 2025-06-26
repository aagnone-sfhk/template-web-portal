"use client";
import React, { useState } from "react";
import Image from "next/image";
import ChatContainer from "./ChatContainer";
import { useChat } from "./ChatContext";
import { Maximize2, Minimize2, X } from "lucide-react";

interface ChatBubbleProps {
  welcomeMessage: string;
  logo: string;
  logoAlt: string;
}

export default function ChatBubble({ welcomeMessage, logo, logoAlt }: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen, hasNotification, openChat, closeChat } = useChat();

  // Reset expanded state when chat is closed
  const handleClose = () => {
    setIsExpanded(false);
    // Might be a bug in AF around this. Use with caution.
    // endSession();
    closeChat();
  };

  return (
    <div className={`fixed rounded-lg bg-white ${
      isExpanded && isOpen
        ? 'top-[104px] bottom-4 right-0' 
        : 'bottom-4 right-4'
    } z-[9999]`}>
      {!isOpen ? (
        <div className="relative">
          <button
            onClick={openChat}
            className="bg-transparent rounded-full w-14 h-14 flex items-center justify-center overflow-hidden"
          >
            <Image
              className="object-cover"
              width={64}
              height={128}
              src={logo}
              alt={logoAlt}
            />
          </button>
          {hasNotification && (
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-sm"></div>
          )}
        </div>
      ) : (
        <div 
          style={{
            width: isExpanded ? '50vw' : '600px',
            height: isExpanded ? '100%' : '800px'
          }}
          className={`p-2 rounded-lg shadow-lg shadow-black flex flex-col ${
            isExpanded ? 'rounded-r-none' : ''
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt={logoAlt}
                width={80}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 p-1"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatContainer welcomeMessage={welcomeMessage} />
          </div>
        </div>
      )}
    </div>
  );
} 