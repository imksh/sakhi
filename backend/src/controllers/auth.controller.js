import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import EmailVerification from "../models/email.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

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

export const verifyEmail = async (req, res) => {
  const { email, name } = req.body;

  try {
    const existingEmail = await EmailVerification.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = generateOtp(email);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });

    console.log("📧 Sending OTP to:", email);

    await transporter.sendMail({
      from: `"Sakhi" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Sakhi Email Verification",
      text: `Hey ${name}, your OTP is ${otp}`,
    });

    console.log("✅ Email sent");

    return res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("SMTP ERROR:", error.message);
    return res.status(500).json({
      message: "Failed to send email. Try again later.",
    });
  }
};

export const signup = async (req, res) => {
  const { name, email, password, number, otp } = req.body;

  const flag = verifyOtp(email, otp);

  if (!flag) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      number: number,
      password: hashedPassword,
    });

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

  if (!expoToken) return res.status(400).json({ message: "Token missing" });

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { pushSubscriptions: expoToken } },
    { new: true }
  );

  res.status(201).json({ message: "Subscribed successfully" });
};

export const sendPushNotification = async (expoToken, payload) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: expoToken,
      sound: "default",
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }),
  });
};
