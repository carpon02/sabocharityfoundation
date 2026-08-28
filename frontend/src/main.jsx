import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import Logger from "./services/logger.js"; // Import Logger
import * as Sentry from "@sentry/react"; // Import Sentry for ErrorBoundary

import { GoogleOAuthProvider } from "@react-oauth/google";

// Initialize Logger (Sentry)
Logger.init();

const rootElement = document.getElementById("root");
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(rootElement).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
