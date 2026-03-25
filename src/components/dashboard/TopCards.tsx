"use client";

import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import {
  COLOR_BORDER,
  COLOR_DANGER,
  COLOR_FOREGROUND_MUTED,
  COLOR_SUCCESS,
  COLOR_SURFACE_ELEVATED,
} from "@/config/colors";

export function TopCards() {
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const quotesBySymbol = useAppSelector((state) => state.market.quotesBySymbol);

  return (
    <Grid container spacing={1.5}>
      {watchlist.map((item) => {
        const quote = quotesBySymbol[item.symbol];
        const isAboveAlert = quote ? quote.price >= item.alertPrice : true;

        return (
          <Grid key={item.symbol} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                overflow: "hidden",
                p: 2.2,
                border: `1px solid ${COLOR_BORDER}`,
                background: `linear-gradient(180deg, ${COLOR_SURFACE_ELEVATED}, rgba(16, 29, 53, 0.92))`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  borderTop: `3px solid ${isAboveAlert ? COLOR_SUCCESS : COLOR_DANGER}`,
                }}
              />
              <Stack spacing={1.1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="overline" color="text.secondary">
                    {item.symbol}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isAboveAlert ? COLOR_SUCCESS : COLOR_DANGER,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {isAboveAlert ? "ABOVE ALERT" : "BELOW ALERT"}
                  </Typography>
                </Stack>
                <Typography variant="h6" fontWeight={700}>
                  {quote ? `$${quote.price.toFixed(2)}` : "No data yet."}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: isAboveAlert ? COLOR_SUCCESS : COLOR_DANGER, fontWeight: 600 }}
                >
                  {quote
                    ? `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`
                    : "0.00%"}
                </Typography>
                <Typography variant="caption" sx={{ color: COLOR_FOREGROUND_MUTED }}>
                  Alert: ${item.alertPrice.toFixed(2)}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
