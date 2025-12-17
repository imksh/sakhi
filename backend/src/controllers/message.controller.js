import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { io, getReceiverSocketId, userSocketMap } from "../lib/socket.js";
import { sendPushNotificationToUser } from '../lib/expoPush';

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!chatId) return res.status(400).json({ message: "chatId is required" });

    const messages = await Message.find({ chatId })
      .populate("sender", "name profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const newMsg = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.body.user._id;
    const len = req.len;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).lean();
    if (messages.length !== len) return res.status(200).json(true);
    res.status(200).json(false);
  } catch (error) {
    console.log("Error in getMessage control: ", error.message);
    res.status(500).json({ message: "Internel Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, chatId } = req.body;
    const senderId = req.user._id;

    // 1. Find conversation
    const conversation = await Conversation.findById(chatId);
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    // 2. Determine receiver (only for 1-to-1 chats)
    const receiverId = conversation.members.find(
      (m) => m.toString() !== senderId.toString()
    );

    // 3. Upload image if exists
    let imageUrl = null;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    // 4. Save message
    const newMessage = await Message.create({
      chatId,
      sender: senderId,
      text,
      image: imageUrl,
    });

    // 5. Update conversation (last message + time)
    conversation.lastMessage = text || "[Image]";
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMsg = await newMessage.populate("sender", "name profilePic");
    

    // 8. Send message through socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMsg);
    }

    if (!receiverSocketId) {
      const shortText =
        text?.length > 20 ? text.substring(0, 20) + "..." : text;

      const payload = {
        title: `New message from ${req.user.name}`,
        body: shortText || "Sent a photo",
        data: { chatId },
      };

      await sendPushNotificationToUser(receiverId, payload);
    }

    return res.status(200).json(populatedMsg);
  } catch (error) {
    console.log("Error in sendMessage control:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Message.findByIdAndDelete(id);
    if (!del) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(204).end();
  } catch (error) {
    console.log("Error in deleteMessage control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// export const clearChat = async (req, res) => {
//   try {
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     const del = await Message.deleteMany({
//       $or: [
//         { senderId: senderId, receiverId: receiverId },
//         { senderId: receiverId, receiverId: senderId },
//       ],
//     });
//     if (del.deletedCount === 0)
//       return res.status(404).json({ message: "Not Found" });
//     res.status(204).end();
//   } catch (error) {
//     console.log("Error in clearChat control: ", error.message);
//     res.status(500).json({ message: "Internel Server Error" });
//   }
// };

// export const setMsg = async (req, res) => {
//   try {
//     const { messages } = req.body;

//     if (!messages || !Array.isArray(messages)) {
//       return res.status(400).json({ message: "Invalid input" });
//     }

//     await Promise.all(
//       messages.map((m) =>
//         Message.findByIdAndUpdate(m._id, { status: "seen" }, { new: true })
//       )
//     );

//     res.status(200).json({ message: "Status Updated" });
//   } catch (error) {
//     console.error("Error in setMsg controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };