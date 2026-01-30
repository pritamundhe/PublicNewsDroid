importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

// Parse configuration from URL query parameters
const config = new URLSearchParams(location.search);

const firebaseConfig = {
    apiKey: config.get("apiKey"),
    authDomain: config.get("authDomain"),
    projectId: config.get("projectId"),
    storageBucket: config.get("storageBucket"),
    messagingSenderId: config.get("messagingSenderId"),
    appId: config.get("appId"),
    measurementId: config.get("measurementId"),
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo192.png",
    });
});
