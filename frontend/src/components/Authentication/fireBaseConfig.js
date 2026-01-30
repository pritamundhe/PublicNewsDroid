import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (userId) => {
  try {
    const token = await getToken(messaging, { vapidKey: "BHfCanZHzUAPSMYy8v8Fx5FFZiTCD2zXK-owHLa8RPWB74rlSFGQ9383khY6XKpKDaSsEMptksY6iU6axk3uOQI" });
    if (token) {
      console.log("Admin Device Token:", token);
      console.log(userId);
      await axios.post("http://localhost:5000/users/updateuserfcmtoken", { userId, fcmToken: token });

    } else {
      console.log("No token available");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
};
