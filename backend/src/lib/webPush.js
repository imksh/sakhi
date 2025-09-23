import webPush from "web-push";

webPush.setVapidDetails(
  "mailto:idioticminds0@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// send push notification function
export const sendPushNotification = async (subscription, payload) => {
  try {
    const result = await webPush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    console.log("notificaiton send");
    
  } catch (err) {
    console.error("Push notification failed:", err);
  }
};
