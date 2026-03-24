import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { WatchlistItem } from "@/types/stock";

interface WatchlistState {
  items: WatchlistItem[];
}

const initialState: WatchlistState = {
  items: [
    { symbol: "AAPL", alertPrice: 251 },
    // { symbol: "MSFT", alertPrice: 400 },
    // { symbol: "ETH-USD", alertPrice: 2135 },
    // { symbol: "AMZN", alertPrice: 2135 },
    // { symbol: "BTC-USD", alertPrice: 2135 },
  ],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<WatchlistItem>) => {
      const alreadyExists = state.items.some(
        (item) => item.symbol === action.payload.symbol,
      );
      if (!alreadyExists) {
        state.items.push(action.payload);
      }
    },
    removeStock: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.symbol !== action.payload);
    },
    updateAlertPrice: (
      state,
      action: PayloadAction<{ symbol: string; alertPrice: number }>,
    ) => {
      const item = state.items.find((entry) => entry.symbol === action.payload.symbol);
      if (item) {
        item.alertPrice = action.payload.alertPrice;
      }
    },
    reorderWatchlist: (
      state,
      action: PayloadAction<{ activeId: string; overId: string }>,
    ) => {
      const oldIndex = state.items.findIndex((item) => item.symbol === action.payload.activeId);
      const newIndex = state.items.findIndex((item) => item.symbol === action.payload.overId);

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return;
      }

      const [moved] = state.items.splice(oldIndex, 1);
      state.items.splice(newIndex, 0, moved);
    },
  },
});

export const { addStock, removeStock, updateAlertPrice, reorderWatchlist } =
  watchlistSlice.actions;

export default watchlistSlice.reducer;
