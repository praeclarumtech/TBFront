import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.scss";
import App from "./App.tsx";
import { Provider } from 'react-redux';
import {store} from "../src/store/store.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
