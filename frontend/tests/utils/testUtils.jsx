import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import campaignReducer from "@/features/campaign/campaignsSlice";
import donationReducer from "@/features/donation/donationSlice";
import blogReducer from "@/features/blog/blogsSlice";
import eventReducer from "@/features/event/eventSlice";

// Create a test store with all reducers
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      campaigns: campaignReducer,
      donations: donationReducer,
      blogs: blogReducer,
      events: eventReducer,
    },
    preloadedState,
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
