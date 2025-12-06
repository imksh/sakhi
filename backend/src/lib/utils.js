import jwt from "jsonwebtoken";

export const generateToken = (userId,req, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const ua = req.headers["user-agent"];

  if (/mobile/i.test(ua)) {
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return token;
};
