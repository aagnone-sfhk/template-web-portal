"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";
import { socketClient } from "./socket";

type SocketContextType = {
  socketClient: typeof socketClient;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

type SocketProviderProps = {
  children: ReactNode;
  sessionId?: string;
};

export const SocketProvider = ({ children, sessionId = "portal" }: SocketProviderProps) => {
  useEffect(() => {
    // Connect to socket when the provider mounts
    socketClient.connect(sessionId);

    // Clean up on unmount
    return () => {
      // We don't disconnect here to maintain the connection across the app
      // socketClient.disconnect();
    };
  }, [sessionId]);

  return (
    <SocketContext.Provider value={{ socketClient }}>
      {children}
    </SocketContext.Provider>
  );
}; 