import { StrictMode } from "react";
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

// Wrapping providers for cleaner structure
const AppWrapper = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider>
          <NavigationProvider>
            <App />
          </NavigationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppWrapper />
    </GoogleOAuthProvider>
  </StrictMode>
);
