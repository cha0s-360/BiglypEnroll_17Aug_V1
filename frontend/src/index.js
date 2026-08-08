import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

// Suppress benign "ResizeObserver loop" warnings so the CRA dev error overlay
// (used by Radix UI components) doesn't intercept clicks in preview.
const RO_MSG = "ResizeObserver loop";
window.addEventListener(
  "error",
  (e) => {
    if (e.message && e.message.includes(RO_MSG)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  },
  true
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
