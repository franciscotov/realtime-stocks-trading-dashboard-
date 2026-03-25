"use client";

import { useEffect, useMemo, useRef } from "react";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Alert, Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
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
import {
  COLOR_ACCENT,
  COLOR_BORDER,
  COLOR_FOREGROUND_MUTED,
  COLOR_SECONDARY,
  COLOR_SURFACE,
  COLOR_SURFACE_ELEVATED,
} from "@/config/colors";

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
    <Stack spacing={2.5}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 6,
          border: `1px solid ${COLOR_BORDER}`,
          background: `linear-gradient(145deg, ${COLOR_SURFACE_ELEVATED} 0%, ${COLOR_SURFACE} 62%, rgba(8, 16, 32, 0.96) 100%)`,
          boxShadow: "0 22px 55px rgba(2, 6, 23, 0.34)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -90,
            right: -90,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(40, 215, 255, 0.28), transparent 68%)`,
          }}
        />
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          spacing={2.5}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Stack spacing={1.4} maxWidth={720}>
            <Typography
              variant="overline"
              sx={{ color: COLOR_ACCENT, letterSpacing: "0.18em", fontWeight: 700 }}
            >
              MARKET DESK
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              Trading Command Center
            </Typography>
            <Typography sx={{ color: COLOR_FOREGROUND_MUTED, maxWidth: 620 }}>
              Track your live watchlist, compare multi-symbol price movement, and route
              push alerts from one market workspace.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`${watchlist.length} symbols tracked`}
                sx={{
                  color: "white",
                  bgcolor: "rgba(44, 140, 255, 0.18)",
                  border: `1px solid ${COLOR_BORDER}`,
                }}
              />
              <Chip
                label="Live websocket stream"
                sx={{
                  color: "white",
                  bgcolor: "rgba(40, 215, 255, 0.12)",
                  border: `1px solid ${COLOR_BORDER}`,
                }}
              />
            </Stack>
          </Stack>
          <Stack justifyContent="space-between" alignItems={{ xs: "stretch", lg: "flex-end" }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<NotificationsActiveIcon />}
              onClick={() => requestNotificationPermission()}
            >
              Enable Push Alerts
            </Button>
            <Typography sx={{ color: COLOR_SECONDARY, fontSize: 13, fontWeight: 600 }}>
              Streaming quotes with interval-aware history aggregation
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {!FINNHUB_API_KEY && (
        <Alert severity="error" sx={{ border: `1px solid ${COLOR_BORDER}` }}>
          Missing environment variable.
        </Alert>
      )}

      <Grid container spacing={2.5}>
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
