"use client";

import { Grid, Paper, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { COLOR_BORDER, COLOR_SUCCESS, COLOR_DANGER } from "@/config/colors";

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
                p: 2,
                border: `1px solid ${COLOR_BORDER}`,
                borderLeft: `5px solid ${isAboveAlert ? COLOR_SUCCESS : COLOR_DANGER}`,
              }}
            >
              <Stack spacing={0.6}>
                <Typography variant="overline" color="text.secondary">
                  {item.symbol}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {quote ? `$${quote.price.toFixed(2)}` : "Loading..."}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: isAboveAlert ? COLOR_SUCCESS : COLOR_DANGER, fontWeight: 600 }}
                >
                  {quote
                    ? `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`
                    : "0.00%"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
