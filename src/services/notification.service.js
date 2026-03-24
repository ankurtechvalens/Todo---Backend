import admin from "../config/firebase.js";

export const sendPushNotification = async (token, title, body) => {
  try {
    const message = {
      token,
      data: {
        title,
        body,
      },
    };

    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);

  } catch (error) {
    console.error("FCM Error:", error);
  }
};