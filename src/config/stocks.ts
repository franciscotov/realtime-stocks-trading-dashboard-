export const STOCK_OPTIONS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
  "AMD",
  "INTC",
  "BABA",
  "JPM",
  "DIS",
  "KO",
  "WMT",
] as const;

export type StockOption = (typeof STOCK_OPTIONS)[number];
