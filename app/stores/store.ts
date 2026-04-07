import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./rootReducer";
import { _middleware } from "./middleware";

// Use configureStore directly (instead of core factory) so we can configure
// serializableCheck — menu items store React elements (icons) in Redux state.
const reduxStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["app/setItemsMenu"],
        ignoredPaths: ["app.memu.items"],
      },
    }).concat(_middleware),
});

export { reduxStore };
