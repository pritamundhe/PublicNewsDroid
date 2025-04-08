importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyCEiAY9WTSiZNPCLxTAJhiPva7Ur4NKdWY",
    authDomain: "publicnewsdroid-df382.firebaseapp.com",
    projectId: "publicnewsdroid-df382",
    storageBucket: "publicnewsdroid-df382.firebasestorage.app",
    messagingSenderId: "376039533864",
    appId: "1:376039533864:web:112e2446de48497532741d",
    measurementId: "G-7MS5ECHN18"
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
