import { FINNHUB_API_KEY } from "@/config/env";
import type { TradeMessage } from "@/types/stock";
type TradeListener = (trade: TradeMessage) => void;

class FinnhubStreamClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<TradeListener>();
  private subscribedSymbols = new Set<string>();
  private reconnectTimer: number | null = null;
  private shouldReconnect = true;

  connect() {
    if (typeof window === "undefined" || this.ws || !FINNHUB_API_KEY) {
      return;
    }

    this.ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

    this.ws.onopen = () => {
      this.subscribedSymbols.forEach((symbol) => this.sendSubscribe(symbol));
    };

    this.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          type?: string;
          data?: Array<{ p: number; s: string; t: number }>;
        };
        // payload.data = [{ p: 10, s: 'AAPL', t: new Date().getMilliseconds() }];
        // payload.type = 'trade';
        if (payload.type !== "trade" || !payload.data) {
          return;
        }
        payload.data.forEach((trade) => {
          this.listeners.forEach((listener) =>
            listener({
              symbol: trade.s,
              price: trade.p,
              timestamp: trade.t,
            }),
          );
        });
      } catch {
        // Ignore malformed trade payloads.
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      if (this.shouldReconnect) {
        this.reconnectTimer = window.setTimeout(() => this.connect(), 2000);
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  subscribe(symbol: string) {
    this.subscribedSymbols.add(symbol);
    this.sendSubscribe(symbol);
  }

  unsubscribe(symbol: string) {
    this.subscribedSymbols.delete(symbol);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  }

  onTrade(listener: TradeListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private sendSubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  }
}

export const finnhubStreamClient = new FinnhubStreamClient();
