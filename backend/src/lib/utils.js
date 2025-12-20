import jwt from "jsonwebtoken";

import PushSubscription from "../models/pushSubscription.model.js";

export const getUserSubscriptions = async (userId) => {
  return await PushSubscription.find({ user: userId });
};

export const generateToken = (userId, req, res) => {
  const platform = req.headers["x-platform"];
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const ua = req.headers["user-agent"];

  if (platform === "web") {
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return token;
};
