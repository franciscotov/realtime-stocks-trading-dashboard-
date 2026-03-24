export type IntervalResolution = "5" | "15";

export interface WatchlistItem {
  symbol: string;
  alertPrice: number;
}

export interface QuoteState {
  symbol: string;
  price: number;
  previousPrice: number | null;
  changePercent: number;
  updatedAt: number;
}

export interface HistoricalPoint {
  timestamp: number;
  price: number;
}

export interface TradeMessage {
  symbol: string;
  price: number;
  timestamp: number;
}
