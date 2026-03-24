"use client";

import { useEffect, useState } from "react";
interface UseStockSymbolsResult {
  symbols: string[];
  loading: boolean;
  error: string | null;
}

export function useStockSymbols(): UseStockSymbolsResult {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/stock/symbols")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load symbols: ${res.status}`);
        return res.json() as Promise<string[]>;
      })
      .then((data) => {
        if (!cancelled) setSymbols(data);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load symbols");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { symbols, loading, error };
}
