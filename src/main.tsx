// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { NavigationProvider } from "./contexts/Nvigation-context.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/Store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "./contexts/SocketContext.tsx";

// Wrapping providers for cleaner structure
const AppWrapper = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketProvider>
      <BrowserRouter>
        <ThemeProvider>
          <NavigationProvider>
            <App />
          </NavigationProvider>
        </ThemeProvider>
      </BrowserRouter>
      </SocketProvider>
    </PersistGate>
  </Provider>
);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppWrapper />
    </GoogleOAuthProvider>
  // </StrictMode>
);
