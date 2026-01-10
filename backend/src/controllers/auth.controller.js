import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import EmailVerification from "../models/email.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import PushSubscription from "../models/pushSubscription.model.js";
import ExpoSubscription from "../models/expoSubscription.model.js";
import { Expo } from "expo-server-sdk";
const expo = new Expo();
const tempEmail = {};

function generateOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 1 * 65 * 1000;
  tempEmail[email] = { otp, expires };
  return otp;
}

function verifyOtp(email, inputOtp) {
  const record = tempEmail[email];
  if (!record) return false;
  if (Date.now() > record.expires) {
    delete tempEmail[email];
    return false;
  }
  if (record.otp === inputOtp) {
    delete tempEmail[email];
    return true;
  }
  return false;
}

export const checkExisting = async (req, res) => {
  const { email } = req.body;
  try {
    const existingEmail = await EmailVerification.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: false });
    }
    return res.status(200).json({ message: true });
  } catch (error) {
    console.log("Error in signup control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, name } = req.body;

  const existingEmail = await EmailVerification.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const otp = generateOtp(email);

  try {
    const msg = {
      to: email,
      from: process.env.from,
      subject: "Sakhi email verification",
      text: `Hey, ${name} \nYour verification code for Sakhi is: ${otp}`,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(msg);
    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.body || error.message
    );
    res.status(500).json({
      message: error.response?.body || error.message || "Internal Server Error",
    });
  }
};

export const signup = async (req, res) => {
  const {
    name,
    email,
    password,
    number,
    otp,
    code,
    publicKey,
    encryptedPrivateKey,
    salt,
    iv,
  } = req.body;

  if (code !== "secret77code@ksh&&45") {
    return res.status(400).json({ message: "Unauthorized" });
  }

  // const flag = verifyOtp(email, otp);

  // if (!flag) {
  //   return res.status(400).json({ message: "Invalid OTP" });
  // }

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt1 = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt1);

    const newUser = new User({
      name: name,
      email: email,
      number: number,
      password: hashedPassword,
      publicKey,
      encryptedPrivateKey,
      salt,
      iv,
    });

    console.log(
      "public: ",
      publicKey,
      "private enc: ",
      encryptedPrivateKey,
      "salt: ",
      salt,
      "iv: ",
      iv
    );

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, req, res);
      await new EmailVerification({ email, user: newUser._id }).save();
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        number: newUser.number || "0000000000",
        // userid: newUser.email.split("@")[0] + Math.floor(Math.random() * 1000),
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const platform = req.headers["x-platform"];
  try {
    console.log("login");

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const flag = await bcrypt.compare(password, user.password);
    if (!flag) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, req, res);

    const authUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      number: user.number,
      profilePic: user.profilePic,
      token,
      publicKey: user.publicKey,
      encryptedPrivateKey: user.encryptedPrivateKey,
      salt: user.salt,
      iv: user.iv,
    };

    return res.status(200).json(authUser);
  } catch (error) {
    console.log("Error in login control:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" });

    const uploadRes = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRes.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateVisibility = async (req, res) => {
  try {
    const { visible } = req.body;
    const userId = req.user._id;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { visible },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in updateVisibility control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth control: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const subscribe = async (req, res) => {
  const { expoToken } = req.body;
  console.log(expoToken);

  if (!expoToken) {
    return res.status(400).json({ message: "Expo token missing" });
  }

  if (!Expo.isExpoPushToken(expoToken)) {
    return res.status(400).json({ message: "Invalid Expo push token" });
  }

  await ExpoSubscription.findOneAndUpdate(
    { token: expoToken },
    { user: req.user._id },
    { upsert: true, new: true }
  );

  res.status(201).json({ message: "Subscribed successfully" });
};

export const webSubscribe = async (req, res) => {
  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription" });
    }
    const userId = req.user._id;

    const exists = await PushSubscription.findOne({
      endpoint: subscription.endpoint,
    });

    if (!exists) {
      await PushSubscription.create({
        user: userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
    }

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
};
