import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
          console.error("Service worker registration failed:", error);
      });
}


root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
