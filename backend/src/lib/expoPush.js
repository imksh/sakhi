import { Expo } from "expo-server-sdk";
import ExpoSubscription from "../models/expoSubscription.model.js";

const expo = new Expo();

export const sendPushNotificationToUser = async (userId, payload) => {
  
  try {
    const subscriptions = await ExpoSubscription.find({ user: userId }).lean();
    if (!subscriptions.length) return;

    const messages = [];

    for (const sub of subscriptions) {
      const token = sub.token;

      if (!Expo.isExpoPushToken(token)) {
        await ExpoSubscription.deleteOne({ _id: sub._id });
        continue;
      }

      messages.push({
        to: token,
        sound: "default",
        title: payload?.title ?? "New Message",
        body: payload?.body ?? "You have a new message",
        data: payload?.data ?? {},
        priority: "high",
      });
    }

    if (!messages.length) return;

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (err) {
    console.error("❌ Push send error:", err);
  }
};