import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoEllipsisVertical, IoTrash } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import typing from "../assets/animations/typing.json";
import { api } from "../lib/axios.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-hot-toast";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const AI = () => {
  const { theme, setTheme, colors } = useThemeStore();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showClearChat, setShowClearChat] = useState(false);
  const scrollRef = useRef(null);
  const [height, setHeight] = useState(
    window.visualViewport ? window.visualViewport.height : window.innerHeight
  );

  let timer;

  const textareaRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [data, height]);

  const handleInput = (e) => {
    setText(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    const handleResize = () => {
      const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      setHeight(vh);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

    let flag = userMsg.text.includes("you");
    flag = flag || userMsg.text.includes("You");
    flag = flag || userMsg.text.includes("your");
    flag = flag || userMsg.text.includes("Your");

    try {
      setIsWaiting(true);
      const message = userMsg.text;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });
      const result = await model.generateContent(message);

      const response = await result.response;
      const reply = response.text();

      let updatedReply;

      updatedReply = reply.replaceAll("Google", "IdioticMinds");
      updatedReply = updatedReply.replaceAll("google", "idioticminds");
      updatedReply = updatedReply.replaceAll("gemini", "sakhi");
      updatedReply = updatedReply.replaceAll("Gemini", "Sakhi");

      let finalReply;

      finalReply = flag ? updatedReply : reply;

      const aiMsg = {
        sender: "ai",
        text: finalReply,
        time: new Date(),
      };

      setData((prev) => {
        const updated = [...prev, aiMsg];
        saveChat(updated);
        return updated;
      });
    } catch (error) {
      setData((prev) => {
        const updated = [
          ...prev,
          { sender: "ai", text: "Something went wrong.", time: new Date() },
        ];
        saveChat(updated);
        return updated;
      });
      console.log(error);
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
      style={{ backgroundColor: colors.surface, height: height }}
    >
      <div className="flex items-center justify-between h-[10dvh] z-99 shadow absolute top-0 left-0 w-full bg-blue-500 px-4 md:px-10 text-white">
        <button onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack size={24} />
        </button>
        <div className="flex items-center gap-3">
          <Lottie animationData={infinity} loop className="w-10 h-10" />
          <div>
            <h1 className="font-semibold text-lg">SakhiAI</h1>
            {isWaiting && (
              <div className="flex items-center relative">
                <p style={{ fontSize: "10px" }}>Typing</p>
                <Lottie
                  animationData={typing}
                  loop
                  className="w-12 h-10 absolute -right-2 "
                />
              </div>
            )}
          </div>
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

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 text-black hide-scrollbar"
      >
        {data.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Lottie animationData={infinity} loop className="w-40 h-40" />
          </div>
        ) : (
          data.map((m, i) => (
            <div
              key={i}
              className={`max-w-[60%] w-fit px-3 pt-2 pb-3  rounded-lg ${
                m.sender === "user"
                  ? "ml-auto bg-green-200"
                  : "mr-auto bg-gray-200"
              }`}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={() => {
                timer = setTimeout(async () => {
                  try {
                    await navigator.clipboard.writeText(m?.text || "");

                    toast.success("Copied to clipboard");
                  } catch (err) {
                    toast.error("Failed to copy");
                  }
                }, 500);
              }}
              onPointerUp={() => clearTimeout(timer)}
              onPointerLeave={() => clearTimeout(timer)}
              onPointerCancel={() => clearTimeout(timer)}
            >
              <div className="flex items-end gap-1 relative min-w-8">
                <p className="mb-0.5">{m.text}</p>
                <p
                  className="text-[10px] text-right text-gray-600 mt-1 min-w-10 absolute -bottom-2 -right-1.5"
                  style={{ fontSize: "8px" }}
                >
                  {timeFormat(m.time)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`flex items-end gap-2 p-3  `}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => handleInput(e)}
          placeholder="Message"
          className={`flex items-end placeholder-gray-400 rounded-2xl p-3 flex-1 overflow-auto hide-scrollbar shrink break-words text-base  outline-none ${
            theme === "light" ? "bg-gray-100" : "bg-[#252525]"
          }`}
          style={{ maxHeight: 70 }}
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
