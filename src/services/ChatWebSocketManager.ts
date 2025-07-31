import { Client, IMessage, StompHeaders, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class ChatWebSocketManager {
  private static instance: ChatWebSocketManager;
  private client: Client;

  // 🔁 Simpan callback+headers untuk resubscribe
  private subscriptionConfigs: Map<string, { callback: (msg: IMessage) => void; headers?: StompHeaders }> = new Map();

  // 🧭 Simpan subscription aktif (untuk mencegah duplikasi)
  private activeSubscriptions: Map<string, StompSubscription> = new Map();

  private constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND}/api/chatRtj`),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("🟢 WebSocket Connected");

        // 🔁 Resubscribe semua topic dengan data lama
        this.subscriptionConfigs.forEach((config, topic) => {
          // Hindari double subscribe
          if (!this.activeSubscriptions.has(topic)) {
            const sub = this.client.subscribe(topic, config.callback, config.headers);
            this.activeSubscriptions.set(topic, sub);
          }
        });
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
      const alreadySubscribed = this.activeSubscriptions.has(topic);

      const doSubscribe = () => {
        // ✅ Subscribe hanya jika belum ada
        if (!alreadySubscribed) {
          const sub = this.client.subscribe(topic, callback, headers);
          this.activeSubscriptions.set(topic, sub);
          this.subscriptionConfigs.set(topic, { callback, headers });
          resolve(sub);
        } else {
          // ✅ Jika sudah, resolve dengan existing subscription
          resolve(this.activeSubscriptions.get(topic)!);
        }
      };

      if (this.client.connected) {
        doSubscribe();
      } else {
        const originalOnConnect = this.client.onConnect;
        this.client.onConnect = (frame) => {
          doSubscribe();
          if (originalOnConnect) originalOnConnect(frame);
        };
      }
    });
  }

  public unsubscribe(topic: string) {
    const sub = this.activeSubscriptions.get(topic);
    sub?.unsubscribe();
    this.activeSubscriptions.delete(topic);
    this.subscriptionConfigs.delete(topic);
  }

  public send(destination: string, body: string) {
    this.client.publish({ destination, body });
  }

  public disconnect() {
    this.client.deactivate();
    this.activeSubscriptions.clear();
  }
}

export default ChatWebSocketManager;
