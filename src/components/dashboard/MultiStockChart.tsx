"use client";

import { memo, useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IntervalResolution } from "@/types/stock";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIntervalResolution } from "@/store/slices/marketSlice";
import { COLOR_BORDER, LINE_COLORS } from "@/config/colors";

export const MultiStockChart = memo(function MultiStockChart() {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.watchlist.items);
  const historyBySymbol = useAppSelector(
    (state) => state.market.historyBySymbol,
  );
  const selectedInterval = useAppSelector(
    (state) => state.market.selectedInterval,
  );
  const chartData = useMemo(() => {
    const pointMap = new Map<number, Record<string, number | string>>();

    watchlist.forEach((item) => {
      const points = historyBySymbol[item.symbol] ?? [];
      points.forEach((point) => {
        const current = pointMap.get(point.timestamp) ?? {
          timestamp: point.timestamp,
          time: new Date(point.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        current[item.symbol] = point.price;
        pointMap.set(point.timestamp, current);
      });
    });

    return Array.from(pointMap.values()).sort(
      (a, b) => Number(a.timestamp) - Number(b.timestamp),
    );
  }, [historyBySymbol, watchlist]);

  const handleIntervalChange = (
    _: unknown,
    next: IntervalResolution | null,
  ) => {
    if (next) {
      dispatch(setIntervalResolution(next));
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, border: `1px solid ${COLOR_BORDER}`, height: 440 }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Multi-stock Time Series
        </Typography>
        <ToggleButtonGroup
          size="small"
          value={selectedInterval}
          exclusive
          onChange={handleIntervalChange}
        >
          <ToggleButton value="5">5m</ToggleButton>
          <ToggleButton value="15">15m</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Box sx={{ width: "100%", height: "calc(100% - 44px)" }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={24} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            {watchlist.map((item, index) => (
              <Line
                key={item.symbol}
                type="monotone"
                dataKey={item.symbol}
                stroke={LINE_COLORS[index % LINE_COLORS.length]}
                strokeWidth={2}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
});
