// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.scss";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { store } from "store/store.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer closeOnClick autoClose={3000} theme="colored" />
    </Provider>
  // </StrictMode>
);
