import { useState, useEffect, useRef } from "react";
import { emojiCategories } from "../utils/emoji.js";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoIosAttach } from "react-icons/io";
import { FaRegHeart, FaTelegramPlane, FaHeart } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { useChatStore } from "../store/useChatStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "motion/react";
import { useThemeStore } from "../store/useThemeStore.js";
import { useAuthStore } from "../store/useAuthStore";
import nacl from "tweetnacl";
import { decodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";
import { useUsersStore } from "../store/useUserStore";

const InputMessage = ({
  text,
  setText,
  imgPrev,
  setImgPrev,
  reply,
  setReply,
  setIsRead,
}) => {
  const {
    isSendingMessage,
    user,
    chatId,
    setUser,
    sendMessage,
    encryptMessage,
  } = useChatStore();
  const { socket, authUser, logout } = useAuthStore();
  const { privateKey, getKey } = useUsersStore();
  const [emoji, setEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const { recent, smileys, animals, food, symbols } = emojiCategories;
  const [width, setWidth] = useState(0);
  const { theme } = useThemeStore();

  const [windowWidth, setWindowWidth] = useState(0);
  const divRef = useRef(null);
  const textAreaHeightRef = useRef(0);
  const TYPING_DELAY = 750;

  useEffect(() => {
    if (imgPrev) {
      setReply(null);
    }
  }, [imgPrev]);

  useEffect(() => {
    if (!textareaRef?.Current) return;
    textAreaHeightRef.current = textareaRef.current.offsetHeight;
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("isTyping", {
      chatId: chatId?._id,
      userId: user?._id,
      status: true,
    });

    const timer = setTimeout(() => {
      socket.emit("isTyping", {
        chatId: chatId?._id,
        userId: user?._id,
        status: false,
      });
    }, TYPING_DELAY);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setWidth(width);
    });

    observer.observe(divRef.current);

    return () => observer.disconnect();
  }, []);

  /* Pick image (web) */
  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPrev(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* Close emoji picker when typing */
  //   useEffect(() => {
  //     if (text.length > 0) setEmoji(false);
  //   }, [text]);

  const handleSend = () => {
    handleSendMessage();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSendMessage = async () => {
    const textMsg = text;
    setText("");
    const img = imgPrev;
    setImgPrev(null);
    setIsRead(false);
    setReply(null);
    let nonceText;
    let cipherText;

    if (!textMsg.trim() && !img) {
      const { nonce, cipher } = encryptMessage(
        privateKey,
        user.publicKey,
        "❤️"
      );
      nonceText = nonce;
      cipherText = cipher;
    } else {
      const { nonce, cipher } = encryptMessage(
        privateKey,
        user.publicKey,
        textMsg.trim()
      );
      nonceText = nonce;
      cipherText = cipher;
    }

    try {
      let m = await sendMessage({
        text: cipherText,
        nonce: nonceText,
        image: img,
        chatId: chatId._id,
        sender: authUser._id,
        replyId: reply?.sender || null,
        reply: reply?.text || null,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log("Failed to send message: " + error);
    }
  };

  return (
    <>
      {/* Input Row */}
      <div className="flex items-end p-2 relative">
        {/* Image Preview */}
        {imgPrev && (
          <div
            className="absolute bottom-13 -left-1 w-full px-3 pb"
            style={{ width: `${width + 48}px` }}
          >
            <div
              className={`${
                theme === "light" ? "bg-gray-100" : "bg-[#252525]"
              } p-3 rounded-t-2xl`}
            >
              <div className="flex items-center justify-between bg-blue-100 text-black p-3 rounded-2xl">
                <img
                  src={imgPrev}
                  alt="preview"
                  className="w-[70px] h-[70px] rounded-lg object-cover"
                />
                <button onClick={() => setImgPrev(null)}>
                  <IoCloseSharp size={28} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input box */}
        <div
          className={` ${
            theme === "light" ? "bg-gray-100" : "bg-[#252525]"
          } flex flex-1 flex-col items-end  rounded-2xl px-3 py-2 z-20`}
          style={{}}
          ref={divRef}
        >
          {reply && (
            <div className="w-full">
              <div
                className={`${
                  theme === "light" ? "bg-gray-100" : "bg-[#252525]"
                } p-1 rounded-t-2xl`}
              >
                <p className="!text-[10px] p-1 pt-0" style={{}}>
                  {reply.sender === authUser._id ? "You" : user.name}
                </p>

                <div className="flex items-center justify-between bg-blue-100 text-black p-3 rounded-lg w-full">
                  <div className="grow text-[12px]">
                    {reply.image ? (
                      <img
                        src={reply.image}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : reply.text.length > 50 ? (
                      <p className="break-all">
                        {reply.text.slice(0, 50).concat("...")}
                      </p>
                    ) : (
                      <p className="break-all ">{reply.text}</p>
                    )}
                  </div>
                  <button onClick={() => setReply(null)}>
                    <IoCloseSharp size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-end justify-between w-full">
            <button className="mb-2" onClick={() => setEmoji((p) => !p)}>
              <MdOutlineEmojiEmotions size={22} />
            </button>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleInput(e)}
              rows={1}
              placeholder="Message"
              className={` flex items-end placeholder-gray-400 rounded-2xl px-3 py-2 w-full overflow-auto hide-scrollbar shrink break-words text-base bg-inherit outline-none`}
              style={{ maxHeight: 70 }}
              onFocus={() => {
                setEmoji(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  console.log(e.key);
                  if (windowWidth > 500) {
                    e.preventDefault();
                    if (text.trim()) handleSend();
                  }
                }
              }}
            />

            <>
              <button
                className={`mx-1 mb-2 `}
                onClick={() => fileInputRef.current.click()}
              >
                <IoIosAttach name="attach-outline" size={20} />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={pickImage}
              />
            </>
          </div>
        </div>

        {/* Send Button */}
        <button
          className="ml-2 rounded-full p-3 mb-2 bg-blue-500 text-white overflow-hidden"
          onClick={() => handleSend()}
          disabled={isSendingMessage}
        >
          {false ? (
            <AiOutlineLoading3Quarters size={20} className="animate-spin" />
          ) : text.length === 0 && !imgPrev ? (
            <motion.div
              animate={{
                x: [-15, 0, 8, 0],

                // scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <FaHeart size={20} className="scale-90" />
            </motion.div>
          ) : (
            <motion.div
              animate={{
                x: [-15, 0],
                y: [15, 0],
                rotate: [50, 0],
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <FaTelegramPlane size={20} />
            </motion.div>
          )}
        </button>
      </div>

      {/* Emoji Picker */}
      {emoji && (
        <div className="h-[280px] w-full p-2 overflow-y-auto hide-scrollbar">
          <p className="font-semibold mb-2">Recent</p>
          <div className="grid grid-cols-7 md:grid-cols-16 lg:grid-cols-20 gap-2 mb-4 justify-center items-center">
            {recent.map((e, i) => (
              <button key={i} onClick={() => setText(text + e)}>
                <span className="text-2xl">{e}</span>
              </button>
            ))}
          </div>
          <p className="font-semibold mb-2">Smileys</p>
          <div className="grid grid-cols-7 md:grid-cols-16 lg:grid-cols-20 gap-2 mb-4 justify-center items-center">
            {smileys.map((e, i) => (
              <button key={i} onClick={() => setText(text + e)}>
                <span className="text-2xl">{e}</span>
              </button>
            ))}
          </div>

          <p className="font-semibold mb-2">Symbols</p>
          <div className="grid grid-cols-7 md:grid-cols-16 lg:grid-cols-20p gap-2 mb-4 justify-center items-center">
            {symbols.map((e, i) => (
              <button key={i} onClick={() => setText(text + e)}>
                <span className="text-2xl">{e}</span>
              </button>
            ))}
          </div>

          <p className="font-semibold mb-2">Animals</p>
          <div className="grid grid-cols-7 md:grid-cols-16 lg:grid-cols-20 gap-2 mb-4 justify-center items-center">
            {animals.map((e, i) => (
              <button key={i} onClick={() => setText(text + e)}>
                <span className="text-2xl">{e}</span>
              </button>
            ))}
          </div>

          <p className="font-semibold mb-2">Food</p>
          <div className="grid grid-cols-7 md:grid-cols-16 lg:grid-cols-20 gap-2 mb-4 justify-center items-center">
            {food.map((e, i) => (
              <button key={i} onClick={() => setText(text + e)}>
                <span className="text-2xl">{e}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default InputMessage;
