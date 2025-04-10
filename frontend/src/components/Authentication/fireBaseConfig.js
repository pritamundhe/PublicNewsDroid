import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
    apiKey: "AIzaSyCEiAY9WTSiZNPCLxTAJhiPva7Ur4NKdWY",
    authDomain: "publicnewsdroid-df382.firebaseapp.com",
    projectId: "publicnewsdroid-df382",
    storageBucket: "publicnewsdroid-df382.firebasestorage.app",
    messagingSenderId: "376039533864",
    appId: "1:376039533864:web:112e2446de48497532741d",
    measurementId: "G-7MS5ECHN18"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (userId) => {
    try {
      const token = await getToken(messaging, { vapidKey: "BHfCanZHzUAPSMYy8v8Fx5FFZiTCD2zXK-owHLa8RPWB74rlSFGQ9383khY6XKpKDaSsEMptksY6iU6axk3uOQI" });
      if (token) {
        console.log("Admin Device Token:", token);
        console.log(userId);
        await axios.post("http://localhost:5000/users/updateuserfcmtoken", { userId, fcmToken: token});
        
      } else {
        console.log("No token available");
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
  };
