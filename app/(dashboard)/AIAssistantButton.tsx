"use client";
import { Button } from "@/components/ui/button";
import { MessageCircleCode } from "lucide-react";
import { useChat } from "@/app/chat/ChatContext";
import { useEffect, useState } from "react";

export default function AIAssistantButton() {
  const { hasNotification, openChat } = useChat();
  const [showTooltip, setShowTooltip] = useState(false);

  // Trigger tooltip animation when notification arrives
  useEffect(() => {
    if (hasNotification) {
      // Small delay to ensure animation triggers
      setTimeout(() => setShowTooltip(true), 10);
    } else {
      setShowTooltip(false);
    }
  }, [hasNotification]);

  const handleClick = () => {
    openChat();
  };

  return (
    <>
      <style>{`
        @keyframes bounceAnimation {
          0%, 40%, 100% {
            transform: translate(-50%, 0);
          }
          10% {
            transform: translate(-50%, -8px);
          }
          20% {
            transform: translate(-50%, 0);
          }
          30% {
            transform: translate(-50%, -4px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .notification-tooltip {
          animation: fadeIn 0.2s ease-out, bounceAnimation 1.2s ease-in-out 0.2s 3;
        }
      `}</style>
      <div className="relative">
        <Button onClick={handleClick} className="relative pr-6">
          <MessageCircleCode className="mr-2 h-4 w-4" />
          Agent Assistant
          {hasNotification && (
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-sm animate-pulse"></div>
          )}
        </Button>
        {showTooltip && (
          <div 
            className="notification-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-lg whitespace-nowrap z-50"
          >
            ✉️ New message!
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-red-500"></div>
          </div>
        )}
      </div>
    </>
  );
}
