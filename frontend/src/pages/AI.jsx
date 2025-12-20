import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoEllipsisVertical, IoTrash } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import { api } from "../lib/axios.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

const AI = () => {
  const { theme, setTheme, colors } = useThemeStore();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showClearChat, setShowClearChat] = useState(false);

  const scrollRef = useRef(null);

  /* auto scroll */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [data]);

  /* load chat */
  useEffect(() => {
    const saved = localStorage.getItem("ai");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const saveChat = (messages) => {
    localStorage.setItem("ai", JSON.stringify(messages));
  };

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      time: new Date(),
    };

    setText("");
    setData((prev) => {
      const updated = [...prev, userMsg];
      saveChat(updated);
      return updated;
    });

    try {
      setIsWaiting(true);

      const res = await api.post("/ai/chat", { message: userMsg.text });

      const aiMsg = {
        sender: "ai",
        text: res.data.reply,
        time: new Date(),
      };

      setData((prev) => {
        const updated = [...prev, aiMsg];
        saveChat(updated);
        return updated;
      });
    } catch {
      setData((prev) => {
        const updated = [
          ...prev,
          { sender: "ai", text: "Something went wrong.", time: new Date() },
        ];
        saveChat(updated);
        return updated;
      });
    } finally {
      setIsWaiting(false);
    }
  };

  const clearChat = () => {
    setData([]);
    localStorage.removeItem("ai");
    setShowClearChat(false);
  };

  const timeFormat = (t) =>
    new Date(t).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div
      className="h-dvh flex flex-col pt-[10dvh]"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="flex items-center justify-between h-[10dvh] z-99 shadow absolute top-0 left-0 w-full bg-blue-500 px-4 md:px-10 text-white">
        <button onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack size={24} />
        </button>
        <div className="flex items-center gap-3">
          <Lottie animationData={infinity} loop className="w-10 h-10" />
          <h1 className="font-semibold text-lg">SakhiAI</h1>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={() => setShowClearChat(!showClearChat)}>
            <FaRegTrashAlt size={22} />
          </button>
          {theme === "light" ? (
            <button onClick={() => setTheme("dark")}>
              <MdOutlineDarkMode size={24} />
            </button>
          ) : (
            <button onClick={() => setTheme("light")}>
              <BsBrightnessHigh size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 text-black"
      >
        {data.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Lottie animationData={infinity} loop className="w-40 h-40" />
          </div>
        ) : (
          data.map((m, i) => (
            <div
              key={i}
              className={`max-w-[60%] w-fit px-3 py-2 rounded-lg ${
                m.sender === "user"
                  ? "ml-auto bg-green-200"
                  : "mr-auto bg-gray-200"
              }`}
            >
              <p>{m.text}</p>
              <p className="text-[10px] text-right text-gray-600 mt-1">
                {timeFormat(m.time)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 p-3 ">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
          className="flex-1 resize-none rounded-2xl px-4 py-2 md:py-3 border max-h-40 placeholder-gray-400 bg-inherit"
        />

        <button
          disabled={isWaiting}
          onClick={handleSendMessage}
          className="bg-blue-600 rounded-full w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-white"
        >
          {text.length > 0 ? (
            <motion.div
              initial={{ x: -15, y: 15, rotate: 50 }}
              animate={{ x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FaTelegramPlane size={22} />
            </motion.div>
          ) : (
            <FaTelegramPlane size={22} />
          )}
        </button>
      </div>

      {/* Clear chat */}
      {showClearChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg text-black p-4  flex flex-col items-center gap-2 w-[80%] max-w-[500px]">
            <Lottie animationData={infinity} loop className="w-24 h-24" />

            <h3 className="font-semibold mb-2">Clear Chat</h3>
            <p className="text-sm mb-4">
              Are you sure you want to clear chat history?
            </p>
            <div className="flex justify-between gap-3 w-[80%] my-4">
              <button
                className="bg-blue-500 text-white flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-blue-700"
                onClick={() => setShowClearChat(false)}
              >
                Cancel
              </button>
              <button
                onClick={clearChat}
                className="bg-red-600 text-white flex items-center gap-1 px-4 py-2 rounded-2xl hover:bg-red-700"
              >
                <IoTrash /> Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AI;
