import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Logger from "./services/logger.js"; // Import Logger
import * as Sentry from "@sentry/react"; // Import Sentry for ErrorBoundary

// Initialize Logger (Sentry)
Logger.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
