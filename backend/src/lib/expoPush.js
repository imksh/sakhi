import { Expo } from "expo-server-sdk";
import User from "../models/user.model.js";
const expo = new Expo();

export const sendPushNotificationToUser = async (userId, payload) => {
  const user = await User.findById(userId).lean();
  if (!user?.pushSubscriptions?.length) return;

  const messages = [];

  for (const token of user.pushSubscriptions) {
    if (!Expo.isExpoPushToken(token)) {
      await User.updateOne(
        { _id: userId },
        { $pull: { pushSubscriptions: token } }
      );
      continue;
    }

    messages.push({
      to: token,
      sound: "default",
      title: payload.title ?? "New Message",
      body: payload.body ?? "You have a new message",
      data: payload.data ?? {},
      priority: "high", 
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  }

  // 🔴 THIS PART WAS MISSING
  const receiptIds = tickets.filter((t) => t.status === "ok").map((t) => t.id);

  if (receiptIds.length === 0) {
    console.log("No valid push receipts");
    return;
  }

  const receiptChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (const chunk of receiptChunks) {
    const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
    console.log("Push receipts:", receipts);
  }
};
