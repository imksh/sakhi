import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
      lowercase: true, 
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    number: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: true,
    },
    contacts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;