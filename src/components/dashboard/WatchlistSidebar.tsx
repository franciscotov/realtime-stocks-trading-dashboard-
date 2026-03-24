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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useStockSymbols } from "@/lib/useStockSymbols";
import { COLOR_BORDER, COLOR_BORDER_SUBTLE } from "@/config/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addStock,
  removeStock,
  reorderWatchlist,
  updateAlertPrice,
} from "@/store/slices/watchlistSlice";

function SortableWatchItem({ symbol }: { symbol: string }) {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    state.watchlist.items.find((entry) => entry.symbol === symbol),
  );

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: symbol,
  });

  if (!item) {
    return null;
  }

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 1.2,
        border: `1px solid ${COLOR_BORDER_SUBTLE}`,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small" {...attributes} {...listeners}>
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ width: 64, fontWeight: 700 }}>{item.symbol}</Typography>
        <TextField
          size="small"
          type="number"
          label="Alert"
          value={item.alertPrice}
          onChange={(event) =>
            dispatch(
              updateAlertPrice({
                symbol: item.symbol,
                alertPrice: Number(event.target.value),
              }),
            )
          }
          sx={{ flex: 1 }}
        />
        <IconButton color="error" onClick={() => dispatch(removeStock(item.symbol))}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}

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
    <Paper elevation={0} sx={{ p: 2, border: `1px solid ${COLOR_BORDER}` }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          Watchlist
        </Typography>

        <Box component="form" onSubmit={onAdd}>
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
            <Button type="submit" variant="contained" disabled={!selectedSymbol || availableSymbols.length === 0}>
              Add to Watchlist
            </Button>
          </Stack>
        </Box>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
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
      </Stack>
    </Paper>
  );
}
