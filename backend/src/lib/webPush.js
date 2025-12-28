import webPush from "web-push";
import PushSubscription from "../models/pushSubscription.model.js";

webPush.setVapidDetails(
  "mailto:idioticminds0@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendPushNotification = async (userId, payload) => {
  const subs = await PushSubscription.find({ user: userId }).lean();
  for (const sub of subs) {
    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
          },
        },
        JSON.stringify(payload)
      );
      
      
    } catch (err) {
      console.error("Web push failed:", err);

      if (err.statusCode === 404 || err.statusCode === 410) {
        await PushSubscription.deleteOne({ _id: sub._id });
      }
    }
  }
};
