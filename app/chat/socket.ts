import { io, Socket } from "socket.io-client";
import { clientEnv } from "app/config/client-env";
import { MessageSchema, VendorOnboard, ProductBackfilled, ChatMessageContent } from "./socket-schemas";

class SocketClient {
  private socket: Socket | null = null;
  private static instance: SocketClient;
  private receivedMessageIds = new Set<string>();
  private messageCallbacks: ((message: ChatMessageContent) => void)[] = [];
  private productBackfilledCallbacks: ((backfilled: ProductBackfilled) => void)[] = [];

  private constructor() {}

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public connect(sessionId: string) {
    if (this.socket) {
      return;
    }

    console.debug("clientEnv.NEXT_PUBLIC_EVENT_HUB_URL", clientEnv.NEXT_PUBLIC_EVENT_HUB_URL);
    this.socket = io(clientEnv.NEXT_PUBLIC_EVENT_HUB_URL.replace("https://", "http://").replace("http://", ""), {
      path: "/socket.io/",
      query: {
        sessionId,
      },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.socket?.emit("initialize", sessionId);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public onConnect(callback: () => void) {
    if (!this.socket) return;
    this.socket.on("connect", callback);
  }

  public onDisconnect(callback: () => void) {
    if (!this.socket) return;
    this.socket.on("disconnect", callback);
  }

  public onMessage(callback: (message: ChatMessageContent) => void) {
    if (!this.socket) return;
    
    // Store the callback
    this.messageCallbacks.push(callback);

    this.socket.on("message", (data: unknown) => {
      try {
        console.log("raw data", data);
        const parsed = MessageSchema.parse(data);
        console.log("parsed", parsed);
        if (parsed.type === "chat" && !this.receivedMessageIds.has(parsed.id)) {
          this.receivedMessageIds.add(parsed.id);
          callback(parsed);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
  }

  public onVendorOnboard(callback: (onboard: VendorOnboard) => void) {
    if (!this.socket) return;

    this.socket.on("vendorOnboard", (data: unknown) => {
      try {
        const parsed = MessageSchema.parse(data);
        if (parsed.type === "vendorOnboard" && !this.receivedMessageIds.has(parsed.id)) {
          this.receivedMessageIds.add(parsed.id);
          callback(parsed);
        }
      } catch (error) {
        console.error("Failed to parse vendor onboard:", error);
      }
    });
  }

  public onProductBackfilled(callback: (backfilled: ProductBackfilled) => void) {
    if (!this.socket) return;
    
    // Store the callback
    this.productBackfilledCallbacks.push(callback);

    this.socket.on("productBackfilled", (data: unknown) => {
      try {
        console.log("productBackfilled", data);
        const parsed = MessageSchema.parse(data);
        console.log("parsed", parsed);
        if (parsed.type === "productBackfilled" && !this.receivedMessageIds.has(parsed.id)) {
          console.log("adding to receivedMessageIds", parsed.id);
          this.receivedMessageIds.add(parsed.id);
          callback(parsed);
        }
      } catch (error) {
        console.error("Failed to parse product backfilled:", error);
      }
    });
  }
}

export const socketClient = SocketClient.getInstance(); 