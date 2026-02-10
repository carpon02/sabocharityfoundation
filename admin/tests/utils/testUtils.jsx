import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// Import reducers
import adminAuthReducer from "@/features/auth/adminAuthSlice";
import adminCampaignsReducer from "@/features/campaign/adminCampaignSlice";
import adminBlogSlice from "@/features/blog/blogSlice";
import settingsReducer from "@/features/settings/settingsSlice";
import adminPaymentsReducer from "@/features/payment/adminPaymentsSlice";
import adminDonorsReducer from "@/features/donor/adminDonorsSlice";
import analyticReducer from "@/features/analytics/analyticsSlice";

// Create a test store with all reducers
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      adminAuth: adminAuthReducer,
      adminCampaigns: adminCampaignsReducer,
      adminBlogs: adminBlogSlice,
      settings: settingsReducer,
      adminDonors: adminDonorsReducer,
      adminPayments: adminPaymentsReducer,
      analytics: analyticReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for tests to avoid issues with non-serializable data in mocks
      }),
  });
}

// Custom render function that includes providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { renderWithProviders as render };
