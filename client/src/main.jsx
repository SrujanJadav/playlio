import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            borderRadius: "16px",
            padding: "12px 20px",
            fontSize: "15px",
          },
          success: {
            style: {
              background: "#C8F5E8",
              color: "#1a6641",
              border: "2px solid #6dd5a8",
            },
          },
          error: {
            style: {
              background: "#FFBCBC",
              color: "#8b2020",
              border: "2px solid #ff8080",
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
