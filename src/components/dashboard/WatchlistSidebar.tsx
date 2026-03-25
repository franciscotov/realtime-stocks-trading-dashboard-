"use client";

import { SubmitEvent, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useStockSymbols } from "@/lib/useStockSymbols";
import {
  COLOR_ACCENT,
  COLOR_BORDER,
  COLOR_BORDER_SUBTLE,
  COLOR_FOREGROUND_MUTED,
} from "@/config/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addStock, reorderWatchlist } from "@/store/slices/watchlistSlice";
import { SortableWatchItem } from "./SortableWatchItem";

export function WatchlistSidebar() {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector((state) => state.watchlist.items);

  const { symbols, loading: symbolsLoading } = useStockSymbols();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [alertPrice, setAlertPrice] = useState<number>(100);

  const availableSymbols = useMemo(() => {
    const used = new Set(watchlist.map((item) => item.symbol));
    return symbols.filter((s) => !used.has(s));
  }, [symbols, watchlist]);

  const sensors = useSensors(useSensor(PointerSensor));

  const onAdd = (event: SubmitEvent) => {
    event.preventDefault();
    if (!selectedSymbol || !Number.isFinite(alertPrice) || alertPrice <= 0) {
      return;
    }

    dispatch(addStock({ symbol: selectedSymbol, alertPrice }));
    setSelectedSymbol(null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    dispatch(
      reorderWatchlist({
        activeId: String(active.id),
        overId: String(over.id),
      }),
    );
  };
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        border: `1px solid ${COLOR_BORDER}`,
        background: `linear-gradient(180deg, rgba(21, 39, 70, 0.96), rgba(16, 29, 53, 0.94))`,
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.6}>
          <Typography variant="h6" fontWeight={700}>
            Watchlist
          </Typography>
          <Typography variant="body2" sx={{ color: COLOR_FOREGROUND_MUTED }}>
            Add U.S. symbols from Finnhub and drag them into your preferred
            order.
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={onAdd}
          sx={{
            p: 1.4,
            borderRadius: 2,
            border: `1px solid ${COLOR_BORDER_SUBTLE}`,
            background: "rgba(9, 17, 31, 0.44)",
          }}
        >
          <Stack spacing={1.2}>
            <Autocomplete
              options={availableSymbols}
              value={selectedSymbol}
              onChange={(_, value) => setSelectedSymbol(value)}
              loading={symbolsLoading}
              disabled={!symbolsLoading && availableSymbols.length === 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stock Symbol"
                  size="small"
                  helperText={
                    symbolsLoading
                      ? "Loading Finnhub symbol universe..."
                      : "Search by ticker"
                  }
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {symbolsLoading && <CircularProgress size={16} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
            <TextField
              size="small"
              label="Price Alert"
              type="number"
              value={alertPrice}
              onChange={(event) => setAlertPrice(Number(event.target.value))}
              inputProps={{ min: 0 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!selectedSymbol || availableSymbols.length === 0}
            >
              Add to Watchlist
            </Button>
          </Stack>
        </Box>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={watchlist.map((item) => item.symbol)}
            strategy={verticalListSortingStrategy}
          >
            <Stack spacing={1}>
              {watchlist.map((item) => (
                <SortableWatchItem key={item.symbol} symbol={item.symbol} />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>

        <Typography variant="caption" sx={{ color: COLOR_ACCENT }}>
          Tip: enable push alerts above to turn your watchlist into a live
          notification feed.
        </Typography>
      </Stack>
    </Paper>
  );
}
