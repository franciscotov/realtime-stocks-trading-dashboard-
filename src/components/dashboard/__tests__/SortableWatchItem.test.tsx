import { fireEvent, screen } from "@testing-library/react";
import { SortableWatchItem } from "@/components/dashboard/SortableWatchItem";
import { renderWithStore } from "@/test/testStore";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
}));

describe("SortableWatchItem", () => {
  it("updates alert price when the input changes", () => {
    const { store } = renderWithStore(<SortableWatchItem symbol="AAPL" />, {
      watchlist: {
        items: [{ symbol: "AAPL", alertPrice: 100 }],
      },
      market: {
        quotesBySymbol: {},
        ticksBySymbol: {},
        historyBySymbol: {},
        selectedInterval: "5",
      },
    });

    fireEvent.change(screen.getByLabelText("Alert"), {
      target: { value: "155" },
    });

    expect(store.getState().watchlist.items[0].alertPrice).toBe(155);
  });

  it("removes the stock when delete button is clicked", () => {
    const { store } = renderWithStore(<SortableWatchItem symbol="AAPL" />, {
      watchlist: {
        items: [{ symbol: "AAPL", alertPrice: 100 }],
      },
      market: {
        quotesBySymbol: {},
        ticksBySymbol: {},
        historyBySymbol: {},
        selectedInterval: "5",
      },
    });

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);

    expect(store.getState().watchlist.items).toHaveLength(0);
  });

  it("returns null when symbol does not exist", () => {
    renderWithStore(<SortableWatchItem symbol="TSLA" />, {
      watchlist: {
        items: [{ symbol: "AAPL", alertPrice: 100 }],
      },
      market: {
        quotesBySymbol: {},
        ticksBySymbol: {},
        historyBySymbol: {},
        selectedInterval: "5",
      },
    });

    expect(screen.queryByText("TSLA")).not.toBeInTheDocument();
  });
});
