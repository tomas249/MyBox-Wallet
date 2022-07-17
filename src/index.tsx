import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import "./styles.css";

import App from "./App";
import { AccountProvider } from "./contexts/AccountsContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <CurrencyProvider>
      <AccountProvider>
        <App />
      </AccountProvider>
    </CurrencyProvider>
  </StrictMode>,
);
