"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatPublisher from "./ChatPublisher";
import ChatMessage from "./ChatMessage";
import type { Message } from "./types";
import { sendStreamingMessage } from "./sse";
import { useChat } from "./ChatContext";

type Props = {
  welcomeMessage: string;
};

type TextChunk = {
  chunk: string;
  offset: number;
};

export default function ChatContainer({}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputChunks, setInputChunks] = useState<TextChunk[]>([]);
  const [aiStatus, setAiStatus] = useState<string>("");
  const [isAiTyping, setAiTyping] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const userMessage = searchParams.get("message");
  const { messages, addMessage } = useChat();

  const handleResponse = async (response: boolean) => {
    // Add user's response to the message history
    addMessage("user", response ? "Yes" : "No", new Date().toISOString());
    
    // Add AI's acknowledgment from template
    const ackMessage = "Your tracking number is T381091234567890. Have a great day!";
    addMessage("ai", ackMessage, new Date().toISOString());

    // When yes, update the product and case to indicate fulfillment
    if (response) {
      try {
        // // Update the audit trail
        // await axios.post(`${clientEnv.NEXT_PUBLIC_EVENT_HUB_URL}/api/slack/vendor-audit-trail`, {
        //   text: getMessageTemplate('VENDOR_ACCEPTED_ASIN_ADJUSTMENTS', { caseId }),
        // })
      } catch (error) {
        console.error('Failed to update case:', error);
      }
    }
  };

  const aiInput: string = useMemo(() => {
    if (inputChunks && inputChunks.length > 0) {
      return inputChunks
        .sort((a: TextChunk, b: TextChunk) => {
          if (a.offset > b.offset) return 1;
          return -1;
        })
        .map(({ chunk }) => chunk)
        .join("");
    }
    return "";
  }, [inputChunks]);

  useEffect(() => {
    setInputChunks([]);
    if (userMessage) {
      addMessage("user", userMessage, new Date().toISOString());
      handlePostMessage(userMessage, messages.length);
    }
  }, [userMessage, messages.length, addMessage]);

  useEffect(() => {
    setAiStatus("");
  }, [aiInput]);

  useEffect(() => {
    setInputChunks([]);
  }, [isAiTyping]);

  const addChunk = (chunk: string, offset: number) => {
    setInputChunks((prev) => [
      ...prev,
      {
        chunk,
        offset,
      },
    ]);
  };

  const onSSEProgressIndicator = (message: string) => {
    setAiStatus(message);
  };
  const onSSETextChunk = (chunk: string, offset: number) => {
    addChunk(chunk, offset);
  };
  const onSSEInform = (message: string) => {
    setAiTyping(false);
    addMessage("ai", message, new Date().toISOString());
  };
  const onSSEEndOfTurn = () => {
    setAiTyping(false);
  };

  const handlePostMessage = async (userMessage: string, sequenceId: number) => {
    setAiTyping(true);
    await sendStreamingMessage({
      userMessage,
      sequenceId,
      onSSEProgressIndicator,
      onSSETextChunk,
      onSSEInform,
      onSSEEndOfTurn,
    });
  };

  const postedMessage = async (message: string) => {
    addMessage("user", message, new Date().toISOString());
    handlePostMessage(message, messages.length);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping, aiInput]);

  const toShowMessages: Message[] = useMemo(() => {
    if (isAiTyping) {
      return [
        ...messages,
        {
          type: "ai",
          message: aiInput,
          aiStatus: aiStatus,
          isTyping: isAiTyping,
          timestamp: new Date().toISOString(),
        },
      ];
    } else {
      return messages;
    }
  }, [messages, isAiTyping, aiInput, aiStatus]);

  return (
    <>
      <div className="flex-1 overflow-y-auto w-full h-full flex flex-col bg-gray-50">
        <div className="flex-1 flex flex-col gap-5 p-4 w-full max-w-4xl mx-auto">
          {toShowMessages.map(function (
            { type, message, isTyping, aiStatus, timestamp, subtype },
            idx
          ) {
            return (
              <ChatMessage
                key={idx}
                type={type}
                message={message}
                aiStatus={aiStatus}
                subtype={subtype}
                isTyping={isTyping}
                timestamp={timestamp}
                handleResponse={handleResponse}
              ></ChatMessage>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="sticky bottom-0 bg-white px-4 py-3 border-t shadow-sm w-full rounded-lg">
          <div className="max-w-4xl mx-auto w-full">
            <ChatPublisher onPostMessage={postedMessage} />
          </div>
        </div>
      </div>
    </>
  );
}
