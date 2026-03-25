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
import {
  COLOR_BORDER,
  COLOR_FOREGROUND_MUTED,
  COLOR_GRID,
  COLOR_SURFACE_ELEVATED,
  LINE_COLORS,
} from "@/config/colors";

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
      sx={{
        p: 2.2,
        border: `1px solid ${COLOR_BORDER}`,
        height: 440,
        background: `linear-gradient(180deg, ${COLOR_SURFACE_ELEVATED}, rgba(16, 29, 53, 0.92))`,
      }}
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
            <CartesianGrid stroke={COLOR_GRID} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" minTickGap={24} tick={{ fill: COLOR_FOREGROUND_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={["auto", "auto"]} tick={{ fill: COLOR_FOREGROUND_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} width={56} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(16, 29, 53, 0.96)",
                border: `1px solid ${COLOR_BORDER}`,
                borderRadius: 14,
              }}
              labelStyle={{ color: "#ecf4ff" }}
              itemStyle={{ color: "#ecf4ff" }}
            />
            <Legend wrapperStyle={{ color: COLOR_FOREGROUND_MUTED }} />
            {watchlist.map((item, index) => (
              <Line
                key={item.symbol}
                type="monotone"
                dataKey={item.symbol}
                stroke={LINE_COLORS[index % LINE_COLORS.length]}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
});
