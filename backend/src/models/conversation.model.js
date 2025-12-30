import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: {
      type: String,
      default: null,
    },

    groupImage: {
      type: String,
      default: null,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    nonce: {
      type: String,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
