import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
export const getUser = async (req, res) => {
  try {
    let { val } = req.body;
    val = val.toLowerCase();
    console.log(val);

    const user = await User.find({
      $or: [{ name: val }, { email: val }, { userid: val }, { number: val }],
    }).select("-password");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log("Error in getUser control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    let { val } = req.body;
    val = val.toLowerCase();

    const users = await User.find({
      $or: [
        { name: { $regex: val, $options: "i" } },
        { email: { $regex: val, $options: "i" } },
        { userid: { $regex: val, $options: "i" } },
        { number: { $regex: val, $options: "i" } },
      ],
    }).select("-password");

    const publicUser = users.filter(
      (u) => u.visible && u._id.toString() !== req.user._id.toString()
    );
    if (publicUser) {
      res.status(200).json(publicUser);
    }
  } catch (error) {
    console.log("Error in getUsers control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const userChatList = async (req, res) => {
//   try {
//     const { user } = req.user;
//     const chats = await Conversation.find({
//       members: user._id,
//     }).sort({ lastMessageAt: -1 });
//     res.status(200).json(chats);
//   } catch (error) {
//     console.log("Error in userChatList control: ", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const chatId = async (req, res) => {
  try {
    const { otherUser } = req.body;
    const user = req.user;

    let chat = await Conversation.findOne({
      members: { $all: [user._id, otherUser._id] },
    });

    if (!chat) {
      chat = await Conversation.create({
        members: [user._id, otherUser._id],
      });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.log("Error in chatId control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Conversation.find({ members: userId })
      .populate("members", "name profilePic")
      .sort({ lastMessageAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const readConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    const conversation = await Conversation.findById(chatId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    conversation.read = true;
    await conversation.save();

    return res.status(200).json(conversation);
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
