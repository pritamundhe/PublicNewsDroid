const admin = require("firebase-admin");

const serviceAccount = require("./publicnewsdroid-df382-firebase-adminsdk-fbsvc-5411935a19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (fcmTokens,title,body) => {
  const message = {
    tokens: fcmTokens, 
    notification: {
        title: title,
        body: body
    },
    android: {
        priority: "high"
    },
    apns: {
        payload: {
            aps: {
                sound: "default"
            }
        }
    }
};

try {
    await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent to users:", title);
} catch (error) {
    console.error("Error sending notification:", error);
}
};

module.exports = { sendNotification };
