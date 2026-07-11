import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#1c1c1f",
          border: "1px solid rgba(255,255,255,0.07)",
          color: "#f0ede8",
          borderRadius: "12px",
          fontSize: "13px",
        },
      }}
    />
  </>
);
  