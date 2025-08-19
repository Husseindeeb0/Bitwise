import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
import { HelmetProvider } from "@dr.pogodin/react-helmet";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  </Provider>
);
