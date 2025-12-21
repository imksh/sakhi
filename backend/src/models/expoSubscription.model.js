import mongoose from "mongoose";

const expoPushTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      enum: ["android", "ios"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExpoPushToken", expoPushTokenSchema);