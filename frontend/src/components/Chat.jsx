import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loading } from "./Loading";
import Lottie from "lottie-react";
import heart from "../assets/animations/heart.json";

import { IoMdArrowRoundBack } from "react-icons/io";
import InputMessage from "./InputMessage";
import { motion } from "motion/react";
import { ImagePreview } from "./ImagePreview";
import { IoIosArrowDown } from "react-icons/io";
import { useUIStore } from "../store/useUIStore";
import { toast } from "react-hot-toast";
import Footer from "./Footer";

export const Chat = () => {
  const [text, setText] = useState("");
  const { messages, chatId, sendMessage, user, setUser, initSocketListener } =
    useChatStore();
  const { showMsgOption, setShowMsgOption } = useUIStore();

  const { authUser, socket, onlineUsers } = useAuthStore();

  const [imgPrev, setImgPrev] = useState(null);
  const fileInputRef = useRef(null);
  const divRef = useRef(null);
  const [data, setData] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [showArrow, setShowArrow] = useState("");

  const scrollRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    } else {
      setIsReady(false);
    }
  }, [user]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [data]);

  useEffect(() => {
    if (socket && authUser) {
      initSocketListener(socket, authUser);
    }
  }, [socket, authUser]);

  // Sync from store
  useEffect(() => {
    if (!chatId?._id) return;
    const cached = messages[chatId._id];
    if (cached) setData(cached);
  }, [messages, chatId]);

  const handleSendMessage = async () => {
    const data = text;
    setText("");
    const img = imgPrev;
    setImgPrev(null);
    try {
      let m;
      if (!data.trim() && !img) {
        m = await sendMessage({
          text: "❤️",
          image: img,
          chatId: chatId._id,
          sender: authUser._id,
          createdAt: new Date(),
        });
      } else {
        m = await sendMessage({
          text: data.trim(),
          image: img,
          chatId: chatId._id,
          sender: authUser._id,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.log("Failed to send message: " + error);
    }
  };

  const timeFormat = (t) => {
    const time = new Date(t).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  };

  // if (!isReady) {
  //   return (
  //     <div className="flex h-dvh w-full items-center justify-center">
  //       <Footer hide={true} />
  //     </div>
  //   );
  // }

  // if (data.length === 0 && !isReady) {
  //   <Loading name="Select a friend to start chatting 💬" className="m-auto" />;
  // }

  return (
    <>
      <div className="h-dvh flex flex-col">
        <div className="bg-blue-500 text-white px-4 h-[10dvh] flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {/* <button onClick={() => setUser(null)}>
              <IoMdArrowRoundBack size={24} />
            </button> */}
            <img
              src={user?.profilePic || "/images/avtar.png"}
              alt=""
              className="rounded-full object-cover w-9 h-9"
            />
            <div className="flex items-baseline justify-center flex-col ">
              <p className="font-bold text-xl">{user?.name}</p>
              {onlineUsers.includes(user._id) ? (
                <p className="text-[11px] ">Online</p>
              ) : (
                <p className="text-[11px] "></p>
              )}
            </div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col grow hide-scrollbar"
        >
          {data.length === 0 ? (
            <Loading
              name="Select a friend to start chatting 💬"
              className="m-auto"
            />
          ) : (
            data.map((message, idx) => {
              const isSelf = String(message?.sender) === String(authUser?._id);

              return (
                <div
                  key={message?._id || idx}
                  className={`relative max-w-[70%] my-1 rounded-lg text-black ${
                    isSelf ? "self-end bg-green-200" : "self-start bg-gray-200"
                  } ${message?.image ? "p-1" : "px-3 py-2"}`}
                  style={
                    message?.text === "❤️"
                      ? {
                          background: "transparent",
                          backgroundColor: "inherit",
                        }
                      : {}
                  }
                  onMouseEnter={() => setShowArrow(message._id || idx)}
                  onMouseLeave={() => setShowArrow("")}
                  onClick={(e) => e.stopPropagation()}
                >
                  {showArrow === message._id && (
                    <button
                      className={`absolute ${
                        isSelf ? "right-2" : "left-2"
                      } top-2 p-0.5 bg-gray-400/70 rounded text-white`}
                      onClick={() => setShowMsgOption(message._id)}
                    >
                      <IoIosArrowDown size={12} />
                    </button>
                  )}

                  {showMsgOption === message._id && (
                    <div
                      className={`absolute right-3 top-6 ${
                        isSelf ? "right-0" : "left-0"
                      } text-white bg-black/80 rounded-2xl   p-1 border border-white text-[12px] w-[15vw] min-w-[200px] flex flex-col items-baseline z-40`}
                    >
                      <button className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline ">
                        Reply
                      </button>
                      <button className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline ">
                        Delete
                      </button>
                      <button
                        className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              message?.text || ""
                            );

                            toast.success("Copied to clipboard");
                          } catch (err) {
                            toast.error("Failed to copy");
                          }
                          setShowMsgOption("");
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  {message?.image && (
                    <button
                      onClick={() => {
                        setImgUrl(message.image);
                        setShowImagePreview(true);
                      }}
                    >
                      <img
                        src={message.image}
                        alt=""
                        className="w-[200px] h-[280px] object-cover rounded"
                      />
                    </button>
                  )}

                  {/* Text */}
                  {message?.text && (
                    <div
                      className={`${message.text === "❤️" ? "text-5xl" : ""}`}
                    >
                      {message.text === "❤️" ? (
                        <Lottie
                          animationData={heart}
                          loop={true}
                          className="w-16 lg:w-20"
                        />
                      ) : (
                        <p>{message.text}</p>
                      )}
                    </div>
                  )}

                  {/* Time */}
                  {message?.text !== "❤️" && (
                    <p className="text-[10px] text-right text-gray-600 mt-1">
                      {timeFormat(message?.createdAt)}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-2">
          <InputMessage
            text={text}
            setText={setText}
            imgPrev={imgPrev}
            send={handleSendMessage}
            fileInputRef={fileInputRef}
            setImgPrev={setImgPrev}
          />
        </div>
      </div>
      {showImagePreview && (
        <ImagePreview uri={imgUrl} setShow={setShowImagePreview} />
      )}
    </>
  );
};
