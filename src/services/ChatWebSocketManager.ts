import { Client, IMessage, StompHeaders, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class ChatWebSocketManager {
  private static instance: ChatWebSocketManager;
  private client: Client;

  private subscriptionConfigs: Map<
    string,
    { callback: (msg: IMessage) => void; headers?: StompHeaders }
  > = new Map();

  private activeSubscriptions: Map<string, StompSubscription> = new Map();

  private constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND}api/chatRtj`),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),

      onConnect: () => {
        console.log("🟢 WebSocket Connected");

        // 🔁 Resubscribe semua topic jika reconnect
        this.subscriptionConfigs.forEach((config, topic) => {
          if (!this.activeSubscriptions.has(topic)) {
            const sub = this.client.subscribe(topic, config.callback, config.headers);
            this.activeSubscriptions.set(topic, sub);
            console.log("📩 Resubscribed to", topic);
          }
        });
      },

      onDisconnect: () => {
        console.warn("🔴 WebSocket disconnected");
      },

      onStompError: (frame) => {
        console.error("💥 STOMP error:", frame);
      },

      onWebSocketClose: (event) => {
        console.warn("🔌 WebSocket closed:", event.reason);
      },

      onWebSocketError: (event) => {
        console.error("🛑 WebSocket error:", event);
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
      const alreadySubscribed = this.activeSubscriptions.has(topic);

      const doSubscribe = () => {
        if (!alreadySubscribed) {
          const sub = this.client.subscribe(topic, callback, headers);
          this.activeSubscriptions.set(topic, sub);
          this.subscriptionConfigs.set(topic, { callback, headers });
          console.log("📩 Subscribed to", topic);
          resolve(sub);
        } else {
          console.log("🟡 Already subscribed to", topic);
          resolve(this.activeSubscriptions.get(topic)!);
        }
      };

      if (this.client.connected) {
        doSubscribe();
      } else {
        // ⏳ Tunggu hingga terhubung, lalu subscribe
        const interval = setInterval(() => {
          if (this.client.connected) {
            clearInterval(interval);
            doSubscribe();
          }
        }, 100);
      }
    });
  }

  public unsubscribe(topic: string) {
    const sub = this.activeSubscriptions.get(topic);
    if (sub) {
      sub.unsubscribe();
      console.log("❌ Unsubscribed from", topic);
    }
    this.activeSubscriptions.delete(topic);
    this.subscriptionConfigs.delete(topic);
  }

  public removeSubscription(topic: string) {
    this.activeSubscriptions.delete(topic);
    this.subscriptionConfigs.delete(topic);
    console.log("🧹 Removed subscription entry for", topic);
  }

  public send(destination: string, body: string) {
    if (!this.client.connected) {
      console.warn("Cannot send message, WebSocket is not connected.");
      return;
    }
    this.client.publish({ destination, body });
  }

  public disconnect() {
    this.client.deactivate();
    this.activeSubscriptions.clear();
    this.subscriptionConfigs.clear();
    console.log("🔌 Disconnected WebSocket and cleared subscriptions");
  }
}

export default ChatWebSocketManager;
