"use client";
import { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from "react";
import { useSocket } from "./SocketContext";
import type { Message } from "./types";
import { sendStreamingMessage } from "./sse";
import type { ProductBackfilled, ChatMessageContent } from "./socket-schemas";

type ChatContextType = {
  isOpen: boolean;
  hasNotification: boolean;
  openChat: () => void;
  closeChat: () => void;
  messages: Message[];
  addMessage: (type: "ai" | "user", message: string, timestamp: string, subtype?: "productBackfilled" | "chat") => void;
  sendMessage: (message: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

type ChatProviderProps = {
  children: ReactNode;
  welcomeMessage: string;
};

export const ChatProvider = ({ children, welcomeMessage }: ChatProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUserSentMessage, setHasUserSentMessage] = useState<boolean>(false);
  const [sequenceId, setSequenceId] = useState<number>(0);
  const { socketClient } = useSocket();
  
  // Use refs to maintain latest state in event listeners
  const messagesRef = useRef<Message[]>([]);
  const hasUserSentMessageRef = useRef<boolean>(false);

  // Update refs when state changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    hasUserSentMessageRef.current = hasUserSentMessage;
  }, [hasUserSentMessage]);

  const openChat = () => {
    console.log("Opening chat from ChatContext");
    setIsOpen(true);
    setHasNotification(false);
  };

  const closeChat = () => {
    console.log("Closing chat from ChatContext");
    setIsOpen(false);
  };

  const addMessage = (type: "ai" | "user", message: string, timestamp: string, subtype?: "productBackfilled" | "chat") => {
    console.log("Adding message to chat", { type, message, timestamp, subtype, currentMessages: messages });
    // If this is a user message, mark that the user has sent a message
    if (type === "user") {
      setHasUserSentMessage(true);
    }
    
    // If this is a product backfilled message and the chat is not open, set the notification flag
    if (subtype === "productBackfilled" && !isOpen) {
      setHasNotification(true);
    }
    
    setMessages(prev => {
      console.log("Previous messages:", prev);
      const newMessages = [
        ...prev,
        {
          type,
          message,
          timestamp,
          subtype,
        },
      ];
      console.log("New messages:", newMessages);
      return newMessages;
    });
  };

  const sendMessage = (message: string) => {
    // Add the user message to the chat
    const timestamp = new Date().toISOString();
    addMessage("user", message, timestamp);
    
    // Increment sequence ID for the next message
    const currentSequenceId = sequenceId;
    setSequenceId(prev => prev + 1);
    
    // Create a temporary message for the AI response
    const aiResponseTimestamp = new Date().toISOString();
    let aiResponseText = "";
    
    // Add an initial AI message with isTyping set to true
    addMessage("ai", "", aiResponseTimestamp, "chat");
    
    // Set isTyping to true for the last message
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.timestamp === aiResponseTimestamp) {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            isTyping: true
          }
        ];
      }
      return prev;
    });
    
    // Send the message to the server
    sendStreamingMessage({
      userMessage: message,
      sequenceId: currentSequenceId,
      onSSEProgressIndicator: (message) => {
        console.log("Progress indicator:", message);
      },
      onSSETextChunk: (message, offset) => {
        // Update the AI response text with the new chunk
        console.debug(offset);
        aiResponseText += message;
        
        // Update or add the AI message in the messages array
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          
          // If the last message is from the AI and it's the one we're updating
          if (lastMessage && lastMessage.type === "ai" && lastMessage.timestamp === aiResponseTimestamp) {
            // Update the existing message
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                message: aiResponseText,
                isTyping: true
              }
            ];
          } else {
            // Add a new AI message
            return [
              ...prev,
              {
                type: "ai",
                message: aiResponseText,
                timestamp: aiResponseTimestamp,
                subtype: "chat",
                isTyping: true
              }
            ];
          }
        });
      },
      onSSEInform: (message) => {
        console.log("Inform:", message);
      },
      onSSEEndOfTurn: () => {
        console.log("End of turn");
        
        // Update the AI message to remove the typing indicator
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          
          if (lastMessage && lastMessage.type === "ai" && lastMessage.timestamp === aiResponseTimestamp) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                isTyping: false
              }
            ];
          }
          return prev;
        });
      }
    });
  };

  const handleProductBackfilled = useCallback((message: ProductBackfilled) => {
    console.log("Handling product backfilled message:", message);
    const currentMessages = messagesRef.current;
    const hasUserMessages = currentMessages.some(msg => msg.type === "user");
    console.log("Current messages:", currentMessages, "Has user messages:", hasUserMessages);
    
    if (!hasUserMessages) {
      // Replace welcome message but keep any other messages
      console.log("No user messages yet, replacing welcome message");
      setMessages(prev => [
        {
          type: "ai" as const,
          message: message.data.content,
          timestamp: message.data.timestamp,
          subtype: "productBackfilled" as const,
        },
        ...prev.slice(1) // Keep all messages after the welcome message
      ]);
    } else {
      // Keep all existing messages and add new one
      console.log("User has sent messages, appending to conversation");
      setMessages(prev => [...prev, {
        type: "ai" as const,
        message: message.data.content,
        timestamp: message.data.timestamp,
        subtype: "productBackfilled" as const,
      }]);
    }

    // Handle notification and chat opening
    if (!isOpen) {
      setHasNotification(true);
      openChat();
    }
  }, [isOpen, openChat]);

  // Initialize messages with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: "ai",
        message: welcomeMessage,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [welcomeMessage]);

  // Set up socket listeners once
  useEffect(() => {
    console.log("Setting up socket event listeners in ChatContext");
    
    const messageHandler = (message: ChatMessageContent) => {
      console.log("Received message via socket:", message);
      addMessage("ai", message.data.content, message.data.timestamp, "chat");
      if (!isOpen) {
        openChat();
      }
    };

    const productBackfilledHandler = (message: ProductBackfilled) => {
      handleProductBackfilled(message);
    };

    socketClient.onMessage(messageHandler);
    socketClient.onProductBackfilled(productBackfilledHandler);
    
    return () => {
      console.log("Cleaning up socket event listeners in ChatContext");
    };
  }, [socketClient, isOpen, handleProductBackfilled, addMessage]);

  useEffect(() => {
    // Check for user messages whenever messages change
    const hasUserMessages = messages.some(msg => msg.type === "user");
    if (hasUserMessages) {
      setHasUserSentMessage(true);
    }
  }, [messages]);

  return (
    <ChatContext.Provider value={{ 
      isOpen, 
      hasNotification, 
      openChat, 
      closeChat, 
      messages, 
      addMessage,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}; 