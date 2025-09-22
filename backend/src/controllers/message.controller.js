import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getAllUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const allUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(allUsers);
  } catch (error) {
    console.log("Error in getAllUser control: ", error.message);
    res.status(500).json({ message: "Internel Server Error" });
  }
};

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch all users except logged-in
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .lean();

    const visibleUsers = allUsers.filter((u) => u.visible);

    // Fetch logged-in user with populated contacts
    const loggedInUser = await User.findById(loggedInUserId)
      .populate("contacts", "name email profilePic number")
      .lean();

    const contactUsers = loggedInUser.contacts || [];

    // Merge visible users + contacts, remove duplicates
    const mergedUsers = [...visibleUsers, ...contactUsers];
    const uniqueUsers = mergedUsers.filter(
      (user, index, self) =>
        index ===
        self.findIndex((u) => u._id.toString() === user._id.toString())
    );

    res.status(200).json(uniqueUsers);
  } catch (error) {
    console.error("Error in getUserForSidebar control:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).lean();
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage control: ", error.message);
    res.status(500).json({ message: "Internel Server Error" });
  }
};

export const getMsg = async (req, res) => {
  try {
    const { id1 } = req.params;
    const { id2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: id1, receiverId: id2 },
        { senderId: id2, receiverId: id1 },
      ],
    }).lean();
    if (!messages.length) return res.status(200).json(null);
    const msg = messages[messages.length - 1];
    res.status(200).json(msg);
  } catch (error) {
    console.log("Error in getMsg control: ", error.message);
    res.status(500).json({ message: "Internel Server Error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const contactSender = req.user.contacts || [];
    contactSender.push(receiverId);
    const updatedContactsSender = [...new Set(contactSender.map(String))];
    await User.findByIdAndUpdate(senderId, { contacts: updatedContactsSender });

    const receiver = await User.findById(receiverId);
    const contactReceiver = receiver?.contacts || [];
    contactReceiver.push(senderId);
    const updatedContactsReceiver = [...new Set(contactReceiver.map(String))];
    await User.findByIdAndUpdate(receiverId, {
      contacts: updatedContactsReceiver,
    });

    const populatedMsg = await newMessage.populate(
      "senderId",
      "name profilePic"
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMsg);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage control: ", error.message);
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
