import { screen } from "@testing-library/react";
import { TopCards } from "@/components/dashboard/TopCards";
import { renderWithStore } from "@/test/testStore";

describe("TopCards", () => {
  it("renders watchlist cards with quote and alert states", () => {
    renderWithStore(<TopCards />, {
      watchlist: {
        items: [
          { symbol: "AAPL", alertPrice: 100 },
          { symbol: "MSFT", alertPrice: 250 },
        ],
      },
      market: {
        quotesBySymbol: {
          AAPL: {
            symbol: "AAPL",
            price: 120,
            previousPrice: 116,
            changePercent: 3.45,
            updatedAt: 1700000000000,
          },
          MSFT: {
            symbol: "MSFT",
            price: 240,
            previousPrice: 250,
            changePercent: -4,
            updatedAt: 1700000001000,
          },
        },
        ticksBySymbol: {},
        historyBySymbol: {},
        selectedInterval: "5",
      },
    });

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("MSFT")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
    expect(screen.getByText("$240.00")).toBeInTheDocument();
    expect(screen.getByText("+3.45%")).toBeInTheDocument();
    expect(screen.getByText("-4.00%")).toBeInTheDocument();
    expect(screen.getByText("ABOVE ALERT")).toBeInTheDocument();
    expect(screen.getByText("BELOW ALERT")).toBeInTheDocument();
  });

  it("shows fallback text when quote data is unavailable", () => {
    renderWithStore(<TopCards />, {
      watchlist: {
        items: [{ symbol: "NVDA", alertPrice: 850 }],
      },
      market: {
        quotesBySymbol: {},
        ticksBySymbol: {},
        historyBySymbol: {},
        selectedInterval: "5",
      },
    });

    expect(screen.getByText("No data yet.")).toBeInTheDocument();
    expect(screen.getByText("0.00%")).toBeInTheDocument();
    expect(screen.getByText("ABOVE ALERT")).toBeInTheDocument();
  });
});
