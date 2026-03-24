import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { HistoricalPoint, IntervalResolution, QuoteState } from "@/types/stock";

interface MarketState {
  quotesBySymbol: Record<string, QuoteState>;
  ticksBySymbol: Record<string, HistoricalPoint[]>;
  historyBySymbol: Record<string, HistoricalPoint[]>;
  selectedInterval: IntervalResolution;
}

const MAX_TICKS_PER_SYMBOL = 720;
const MAX_BUCKET_POINTS_PER_SYMBOL = 240;

const getIntervalMs = (resolution: IntervalResolution) =>
  Number(resolution) * 60 * 1000;

const aggregateTicks = (
  ticks: HistoricalPoint[],
  resolution: IntervalResolution,
): HistoricalPoint[] => {
  if (ticks.length === 0) {
    return [];
  }

  const intervalMs = getIntervalMs(resolution);
  const bucketMap = new Map<number, number>();

  ticks.forEach((tick) => {
    const bucketTimestamp = Math.floor(tick.timestamp / intervalMs) * intervalMs;
    bucketMap.set(bucketTimestamp, tick.price);
  });

  return Array.from(bucketMap.entries())
    .map(([timestamp, price]) => ({ timestamp, price }))
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-MAX_BUCKET_POINTS_PER_SYMBOL);
};

const initialState: MarketState = {
  quotesBySymbol: {},
  ticksBySymbol: {},
  historyBySymbol: {},
  selectedInterval: "1", // set in one just for debugging purposes
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    quoteReceived: (
      state,
      action: PayloadAction<{ symbol: string; price: number; timestamp: number }>,
    ) => {
      const current = state.quotesBySymbol[action.payload.symbol];
      const previousPrice = current?.price ?? null;
      const changePercent =
        previousPrice && previousPrice > 0
          ? ((action.payload.price - previousPrice) / previousPrice) * 100
          : 0;

      state.quotesBySymbol[action.payload.symbol] = {
        symbol: action.payload.symbol,
        price: action.payload.price,
        previousPrice,
        changePercent,
        updatedAt: action.payload.timestamp,
      };

      const symbolTicks = state.ticksBySymbol[action.payload.symbol] ?? [];
      symbolTicks.push({
        timestamp: action.payload.timestamp,
        price: action.payload.price,
      });

      state.ticksBySymbol[action.payload.symbol] = symbolTicks.slice(
        -MAX_TICKS_PER_SYMBOL,
      );
      state.historyBySymbol[action.payload.symbol] = aggregateTicks(
        state.ticksBySymbol[action.payload.symbol],
        state.selectedInterval,
      );
    },
    clearHistoryForSymbol: (state, action: PayloadAction<string>) => {
      delete state.historyBySymbol[action.payload];
      delete state.ticksBySymbol[action.payload];
    },
    setIntervalResolution: (state, action: PayloadAction<IntervalResolution>) => {
      state.selectedInterval = action.payload;

      Object.keys(state.ticksBySymbol).forEach((symbol) => {
        state.historyBySymbol[symbol] = aggregateTicks(
          state.ticksBySymbol[symbol],
          state.selectedInterval,
        );
      });
    },
  },
});

export const {
  quoteReceived,
  clearHistoryForSymbol,
  setIntervalResolution,
} = marketSlice.actions;

export default marketSlice.reducer;
