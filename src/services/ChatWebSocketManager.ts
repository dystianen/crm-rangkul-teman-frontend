import { Client, IMessage, StompHeaders, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class ChatWebSocketManager {
  private static instance: ChatWebSocketManager;
  private client: Client;

  private constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND}api`),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("🟢 WebSocket Connected");
      },
      onStompError: (frame) => {
        console.error("Broker error", frame);
      }
    });
    this.client.activate();
  }

  public static getInstance(): ChatWebSocketManager {
    if (!ChatWebSocketManager.instance) {
      ChatWebSocketManager.instance = new ChatWebSocketManager();
    }
    return ChatWebSocketManager.instance;
  }

  public subscribeWhenConnected(
    topic: string,
    callback: (msg: IMessage) => void,
    headers?: StompHeaders
  ): Promise<StompSubscription> {
    return new Promise((resolve) => {
      if (this.client.connected) {
        const subscription = this.client.subscribe(topic, callback, headers);
        return resolve(subscription);
      }

      const originalOnConnect = this.client.onConnect;

      this.client.onConnect = (frame) => {
        const subscription = this.client.subscribe(topic, callback, headers);
        resolve(subscription);

        if (originalOnConnect) {
          originalOnConnect(frame);
        }

        this.client.onConnect = originalOnConnect;
      };
    });
  }

  public subscribe(
    topic: string,
    callback: (msg: IMessage) => void,
    headers?: StompHeaders
  ): StompSubscription | undefined {
    if (!this.client.connected) return;

    return this.client.subscribe(topic, callback, headers);
  }

  public send(destination: string, body: string) {
    this.client.publish({ destination, body });
  }

  public disconnect() {
    this.client.deactivate();
  }
}

export default ChatWebSocketManager;
