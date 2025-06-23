import React from "react";
import ReactDOM from "react-dom/client";
import AuthContainer from "./Auth.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContainer />
  </React.StrictMode>
);
