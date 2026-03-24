import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "@/store/slices/watchlistSlice";
import marketReducer from "@/store/slices/marketSlice";

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    market: marketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
