import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/variables.css";
import "@/styles/themes.css";
import "@/styles/globals.css";
import "@/styles/components.css";

import Root from "@/app/Root";
import { ThemeProvider } from "@/contexts/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);