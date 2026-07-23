/**
 * @file main.jsx
 * @description Entry point for the CodeSpark React application.
 * Initializes React and renders the root App component.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Renders the root React application into the HTML DOM.
 *
 * The application is mounted to the element with the ID `root`
 * defined in `index.html`.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);