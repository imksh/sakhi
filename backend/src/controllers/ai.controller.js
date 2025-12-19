import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent(message);

    const response = await result.response;
    const reply = response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({ error: "AI response failed" });
  }
};
