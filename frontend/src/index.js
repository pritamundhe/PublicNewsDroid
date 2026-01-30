import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(
      `/firebase-messaging-sw.js?apiKey=${process.env.REACT_APP_FIREBASE_API_KEY}&authDomain=${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}&projectId=${process.env.REACT_APP_FIREBASE_PROJECT_ID}&storageBucket=${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}&messagingSenderId=${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}&appId=${process.env.REACT_APP_FIREBASE_APP_ID}&measurementId=${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`
    )
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
