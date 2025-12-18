import { Expo } from "expo-server-sdk";
import User from "../models/user.model.js";
const expo = new Expo();

export const sendPushNotificationToUser = async (userId, payload) => {
  const user = await User.findById(userId).lean();
  if (!user?.pushSubscriptions?.length) return;

  const messages = [];

  for (const token of user.pushSubscriptions) {
    if (!Expo.isExpoPushToken(token)) {
      // remove invalid token
      await User.updateOne(
        { _id: userId },
        { $pull: { pushSubscriptions: token } }
      );
      continue;
    }

    messages.push({
      to: token,
      sound: "default",
      title: payload.title || "New Message",
      body: payload.body || "You have a new message",
      data: payload.data || {},
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
};