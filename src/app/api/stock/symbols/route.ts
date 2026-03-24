import { NextResponse } from "next/server";

interface StockSymbolEntry {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key is not configured." },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`,
    { next: { revalidate: Infinity } },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `Finnhub responded with ${response.status}` },
      { status: response.status },
    );
  }

  const data = (await response.json()) as StockSymbolEntry[];
  const symbols = data
    .map((entry) => entry.displaySymbol)
    .filter(Boolean)
    .sort();

  return NextResponse.json(symbols);
}
