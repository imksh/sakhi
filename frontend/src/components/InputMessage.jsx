import { useState, useEffect, useRef } from "react";
import { emojiCategories } from "../utils/emoji.js";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoIosAttach } from "react-icons/io";
import { FaRegHeart, FaTelegramPlane,FaHeart } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { useChatStore } from "../store/useChatStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "motion/react";
import { useThemeStore } from "../store/useThemeStore.js";

const InputMessage = ({ text, setText, imgPrev, send, setImgPrev }) => {
  const { isSendingMessage } = useChatStore();
  const [emoji, setEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const { recent, smileys, animals, food, symbols } = emojiCategories;
  const [width, setWidth] = useState(0);
  const [heart, setHeart] = useState(false);
  const { theme, colors } = useThemeStore();

  const divRef = useRef(null);

  

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
    send();
    // setHeart(true);
    // setTimeout(() => {
    //   setHeart(false);
    // }, 1000);
  };

  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
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
          } flex flex-1 items-end  rounded-2xl px-3 py-2 z-20`}
          style={{}}
          ref={divRef}
        >
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

        {/* Send Button */}
        <button
          className="ml-2 rounded-full p-3 mb-2 bg-blue-500 text-white overflow-hidden"
          onClick={() => handleSend()}
          disabled={isSendingMessage}
        >
          {isSendingMessage ? (
            <AiOutlineLoading3Quarters size={20} className="animate-spin" />
          ) : text.length === 0 && !imgPrev ? (
            <motion.div
              animate={{
                x: [-15,0,8,0],
                
                // scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <FaHeart size={20} color="red" className="scale-120" />
            </motion.div>
          ) : (
            <motion.div
              animate={{
                x: [-15, 0],
                y: [15, 0],
                rotate: [50, 0],
              }}
              transition={{
                duration: 1,
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
