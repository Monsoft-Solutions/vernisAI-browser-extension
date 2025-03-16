import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";
import "../styles/globals.css";
import { Toaster } from "../components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
    <Toaster />
  </React.StrictMode>,
);
