import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loading } from "./Loading";
import Lottie from "lottie-react";
import heart from "../assets/animations/heart.json";
import { IoMdArrowRoundBack } from "react-icons/io";
import InputMessage from "./InputMessage";
import { ImagePreview } from "./ImagePreview";

import { IoIosArrowDown } from "react-icons/io";
import { useUIStore } from "../store/useUIStore";
import { toast } from "react-hot-toast";
import Footer from "./Footer";
import { motion } from "motion/react";

export const PhoneChat = () => {
  const [text, setText] = useState("");
  const {
    messages,
    chatId,
    sendMessage,
    user,
    setUser,
    conversations,
    readChat,
  } = useChatStore();

  const { authUser, onlineUsers, socket } = useAuthStore();
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const { showMsgOption, setShowMsgOption } = useUIStore();
  const [isRead, setIsRead] = useState(false);

  const [imgPrev, setImgPrev] = useState(null);
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [height, setHeight] = useState(
    window.visualViewport ? window.visualViewport.height : window.innerHeight
  );
  const scrollRef = useRef();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!chatId?._id || !authUser?._id) return;

    const chat = conversations.find((i) => i._id.toString() === chatId._id);
    if (!chat) return;

    if (chat.sender?.toString() === authUser._id.toString()) {
      setIsRead(chat.read);
    } else {
      setIsRead(true);
    }
    console.log(chat?.read);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleReadMessage = ({ chatId: readChatId }) => {
      if (readChatId === chatId?._id) {
        setIsRead(true);
      }
    };

    socket.on("readMessage", handleReadMessage);
    return () => socket.off("readMessage", handleReadMessage);
  }, [socket, chatId?._id]);

  useEffect(() => {
    if (!socket || !chatId?._id || !authUser?._id) return;
    if (authUser._id === user?._id) return;
    if (!data.length) return;

    socket.emit("markAsRead", {
      chatId: chatId._id,
      senderId: user._id,
    });
  }, [socket, chatId?._id, data.length]);

  useEffect(() => {
    const fun = async () => {
      const chat = conversations.find((i) => i._id.toString() === chatId._id);
      if (user?._id?.toString() === chat?.sender?.toString() && !chat?.read) {
        await readChat(chat);
      }
    };
    fun();
  }, [chatId, conversations, user, readChat]);

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
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [data, height, user]);

  // Load cached messages
  useEffect(() => {
    if (!chatId?._id) return;
    const cached = JSON.parse(localStorage.getItem(chatId._id) || "[]");
    setData(cached);
  }, [chatId]);

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
      setIsRead(false);
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

  return (
    <>
      <div className="flex flex-col" style={{ height: height }}>
        <div className="bg-blue-500 text-white px-4 h-[10dvh] flex items-center justify-between fixed top-0 left-0 w-full z-99 shrink-0 ">
          <div className="flex gap-2 items-center">
            <button onClick={() => setUser(null)}>
              <IoMdArrowRoundBack size={24} />
            </button>
            <img
              src={user?.profilePic || "/images/avtar.png"}
              alt=""
              className="rounded-full object-cover w-8 h-8"
            />
            <div className="flex items-baseline justify-center flex-col ">
              <p className="font-bold text-xl">{user?.name}</p>
              {onlineUsers.includes(user._id) ? (
                <p style={{ fontSize: "9px" }}>Online</p>
              ) : (
                <p style={{ fontSize: "9px" }}></p>
              )}
            </div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pb-3 px-3 pt-[10dvh] flex flex-col grow hide-scrollbar"
        >
          {data.length === 0 ? (
            <Footer hide={true} />
          ) : (
            data.map((message, idx) => {
              const isSelf = String(message?.sender) === String(authUser?._id);
              const pressTime = 500;
              let timer = 0;

              return (
                <div
                  key={message?._id || idx}
                  className={` relative max-w-[75%] my-0.5 text-black rounded-lg ${
                    isSelf ? "self-end bg-green-200" : "self-start bg-gray-200"
                  } ${message?.image ? "p-1 pb-3" : "px-3 pt-2 pb-3"}`}
                  style={
                    message?.text === "❤️"
                      ? {
                          background: "transparent",
                          backgroundColor: "inherit",
                        }
                      : {}
                  }
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={() => {
                    timer = setTimeout(() => {
                      setShowMsgOption(message._id);
                    }, pressTime);
                  }}
                  onPointerUp={() => clearTimeout(timer)}
                  onPointerLeave={() => clearTimeout(timer)}
                  onPointerCancel={() => clearTimeout(timer)}
                >
                  {!message?.image && (
                    <div className="bg-white/0 w-full h-full absolute top-0 left-0"></div>
                  )}
                  {showMsgOption === message._id && (
                    <div
                      className={`absolute ${
                        isSelf ? "right-0" : "left-0"
                      } top-6 text-white bg-black/80 rounded-2xl   p-1 border border-white text-[12px] w-[15vw] min-w-[200px] flex flex-col items-baseline z-40`}
                    >
                      <button
                        className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                        onClick={() => {
                          toast.success("This will be added soon");
                        }}
                      >
                        Reply
                      </button>
                      <button
                        className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                        onClick={() => {
                          toast.success("This will be added soon");
                        }}
                      >
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
                      {message.text === "❤️" && (
                        <Lottie
                          animationData={heart}
                          loop={true}
                          className="w-16 lg:w-20"
                        />
                      )}
                    </div>
                  )}

                  {message.text !== "❤️" && (
                    <div className="flex items-end gap-1 relative min-w-8">
                      <p className="mb-0.5">{message.text}</p>
                      <p
                        className="text-[10px] text-right text-gray-600 mt-1 min-w-10 absolute -bottom-2 -right-0.5"
                        style={{ fontSize: "8px" }}
                      >
                        {timeFormat(message?.createdAt)}
                      </p>
                    </div>
                  )}

                  {/*                  
                  {message?.text !== "❤️" && (
                    <p
                      className=" text-right text-gray-600 mt-1"
                      style={{ fontSize: "8px" }}
                    >
                      {timeFormat(message?.createdAt)}
                    </p>
                  )} */}
                </div>
              );
            })
          )}
        </div>

        <div className="h-0 relative ">
          
          {isRead && (
            <motion.div
              drag
              className="flex justify-end absolute -bottom-2 right-2 w-4 h-4 rounded-full overflow-hidden"
              animate={{
                x: [25,0],
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              <div className="bg-white/0 absolute top-0 left-0 w-full h-full"></div>
              <img
                src={user?.profilePic || "/images/avtar.png"}
                alt="User"
                className="w-4 h-4 rounded-full ml-auto "
              />
            </motion.div>
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
