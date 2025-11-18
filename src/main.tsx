import { createRoot } from "react-dom/client";
import "./styles/theme.scss";
import App from "./App";
import { ToastContainer } from "react-toastify";
import { store } from "store/store";
import { Provider } from "react-redux";
import { AbilityProvider } from "ability/AbilityProvider"; // ✅ use provider
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "contexts/query-client";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AbilityProvider>
        <App />
        <ToastContainer closeOnClick autoClose={3000} theme="colored" />
      </AbilityProvider>
    </QueryClientProvider>
  </Provider>
);
