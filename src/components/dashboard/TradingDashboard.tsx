"use client";

import { useEffect, useMemo, useRef } from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Alert, Button, Grid, Stack, Typography } from "@mui/material";
import { FINNHUB_API_KEY } from "@/config/env";
import { finnhubStreamClient } from "@/lib/finnhubClient";
import {
  notifyPriceDrop,
  requestNotificationPermission,
} from "@/lib/notificationService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearHistoryForSymbol,
  quoteReceived,
} from "@/store/slices/marketSlice";
import { MultiStockChart } from "@/components/dashboard/MultiStockChart";
import { TopCards } from "@/components/dashboard/TopCards";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";

export function TradingDashboard() {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const quotesBySymbol = useAppSelector((state) => state.market.quotesBySymbol);

  const symbols = useMemo(() => watchlist.map((item) => item.symbol), [watchlist]);
  const subscribedRef = useRef(new Set<string>());

  // initializing the socket and suscribing the listener for on trade messages
  useEffect(() => {
    if (!FINNHUB_API_KEY) {
      return;
    }

    finnhubStreamClient.connect();
    const unsubscribe = finnhubStreamClient.onTrade((trade) => {
      dispatch(
        quoteReceived({
          symbol: trade.symbol,
          price: trade.price,
          timestamp: trade.timestamp,
        }),
      );
    });

    return () => {
      unsubscribe();
      finnhubStreamClient.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    const current = subscribedRef.current;
    const next = new Set(symbols);

    current.forEach((symbol) => {
      if (!next.has(symbol)) {
        finnhubStreamClient.unsubscribe(symbol);
        dispatch(clearHistoryForSymbol(symbol));
      }
    });

    next.forEach((symbol) => {
      if (!current.has(symbol)) {
        finnhubStreamClient.subscribe(symbol);
      }
    });

    subscribedRef.current = next;
  }, [dispatch, symbols]);

  // alerts
  useEffect(() => {
    watchlist.forEach((item) => {
      const quote = quotesBySymbol[item.symbol];
      if (!quote) {
        return;
      }

      if (quote.price < item.alertPrice) {
        notifyPriceDrop(item.symbol, quote.price, item.alertPrice);
      }
    });
  }, [quotesBySymbol, watchlist]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          Real-time Trading Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<NotificationsActiveIcon />}
          onClick={() => requestNotificationPermission()}
        >
          Enable Notifications
        </Button>
      </Stack>

      {!FINNHUB_API_KEY && (
        <Alert severity="error">
          Missing NEXT_PUBLIC_FINNHUB_API_KEY in your .env.local.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <WatchlistSidebar />
        </Grid>
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Stack spacing={2}>
            <TopCards />
            <MultiStockChart />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
