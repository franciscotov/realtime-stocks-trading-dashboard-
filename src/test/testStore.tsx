import { PropsWithChildren, type ReactElement } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import watchlistReducer from "@/store/slices/watchlistSlice";
import marketReducer from "@/store/slices/marketSlice";

const reducer = combineReducers({
  watchlist: watchlistReducer,
  market: marketReducer,
});

export type TestStoreState = {
  watchlist: ReturnType<typeof watchlistReducer>;
  market: ReturnType<typeof marketReducer>;
};

export function createTestStore(preloadedState?: Partial<TestStoreState>) {
  return configureStore({
    reducer,
    preloadedState,
  });
}

export function renderWithStore(
  ui: ReactElement,
  preloadedState?: Partial<TestStoreState>,
) {
  const store = createTestStore(preloadedState);

  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
