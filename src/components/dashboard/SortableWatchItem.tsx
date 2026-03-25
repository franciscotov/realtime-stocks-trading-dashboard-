"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { COLOR_BORDER_SUBTLE, COLOR_SURFACE_ELEVATED } from "@/config/colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeStock, updateAlertPrice } from "@/store/slices/watchlistSlice";

export function SortableWatchItem({ symbol }: { symbol: string }) {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    state.watchlist.items.find((entry) => entry.symbol === symbol),
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: symbol,
    });

  if (!item) {
    return null;
  }

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 1.4,
        border: `1px solid ${COLOR_BORDER_SUBTLE}`,
        background: `linear-gradient(180deg, ${COLOR_SURFACE_ELEVATED}, rgba(16, 29, 53, 0.9))`,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small" {...attributes} {...listeners}>
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <Typography
          sx={{ width: 64, fontWeight: 700, letterSpacing: "0.04em" }}
        >
          {item.symbol}
        </Typography>
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
        <IconButton
          color="error"
          onClick={() => dispatch(removeStock(item.symbol))}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}
