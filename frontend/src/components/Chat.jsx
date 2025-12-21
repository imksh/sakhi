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

import Typing from "../assets/animations/typing.json";
import Footer from "./Footer";
import { useThemeStore } from "../store/useThemeStore";
import { CiMenuKebab } from "react-icons/ci";

export const Chat = () => {
  const [text, setText] = useState("");
  const {
    messages,
    chatId,
    sendMessage,
    user,
    setUser,
    initSocketListener,
    conversations,
    readChat,
  } = useChatStore();
  const { showMsgOption, setShowMsgOption, showOption, setShowOption } =
    useUIStore();

  const { authUser, socket, onlineUsers } = useAuthStore();

  const [imgPrev, setImgPrev] = useState(null);
  const fileInputRef = useRef(null);
  const divRef = useRef(null);
  const [data, setData] = useState([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [showArrow, setShowArrow] = useState("");
  const [isRead, setIsRead] = useState(false);
  const { theme } = useThemeStore();

  const scrollRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [typing, setTyping] = useState(false);

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

  //Typing Socket Recieve
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ status, chatId: readChatId }) => {
      if (readChatId === chatId?._id) {
        setTyping(status);
      }
    };

    socket.on("handleTyping", handleTyping);
    return () => socket.off("handleTyping", handleTyping);
  }, [socket, chatId?._id]);

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
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [data, isRead]);

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
    setIsRead(false);
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
                typing ? (
                  <p className="text-[11px] ">Typing</p>
                ) : (
                  <p className="text-[11px] ">Online</p>
                )
              ) : (
                <p className="text-[11px] "></p>
              )}
            </div>
          </div>
          <div className="">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOption(!showOption);
              }}
            >
              <CiMenuKebab />
            </button>
            {showOption && (
              <div
                className={`absolute top-[10dvh] -right-0  ${
                  theme === "light"
                    ? "bg-white text-black border-black"
                    : "bg-black text-white border-white "
                }  rounded-l-2xl  px-1 py-2  border  text-[12px] w-[15vw] min-w-[200px] flex flex-col items-baseline z-40`}
              >
                <button
                  className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                  onClick={() => {
                    toast.success("This will be added soon");
                  }}
                >
                  View Profile
                </button>
                <button
                  className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                  onClick={() => {
                    toast.success("This will be added soon");
                  }}
                >
                  Clear Chat
                </button>
                <div
                  className={`border ${
                    theme === "light" ? "border-gray-300 " : "border-gray-500 "
                  } w-full`}
                  style={{ borderWidth: "0.5px" }}
                ></div>
                <button
                  className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6  flex justify-baseline"
                  onClick={() => {
                    toast.success("This will be added soon");
                  }}
                >
                  Block
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col grow hide-scrollbar text-[14px]"
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
                  className={`relative max-w-[70%] my-0.5 rounded-lg text-black ${
                    isSelf ? "self-end bg-green-200" : "self-start bg-gray-200"
                  } ${message?.image ? "p-1 pb-3" : "px-3 pt-1 pb-3"}`}
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
                      className={`absolute z-20 ${
                        isSelf ? "right-1" : "left-1"
                      } top-1 p-0.5 bg-gray-400 rounded text-white`}
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
                      <button
                        className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                        onClick={() => {
                          toast.success("This will be added soon");
                          setShowMsgOption("");
                        }}
                      >
                        Reply
                      </button>
                      <button
                        className="hover:bg-blue-500 w-full rounded-xl py-2 pl-6 flex justify-baseline "
                        onClick={() => {
                          toast.success("This will be added soon");
                          setShowMsgOption("");
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

                  {/* Time */}
                  {message?.text !== "❤️" && (
                    <div className="flex items-end gap-1 relative min-w-8">
                      <p className="mb-0.5">{message.text}</p>
                      <p
                        className={`text-[10px] text-right text-gray-600 mt-1 min-w-10 absolute -bottom-2  ${
                          message.image ? "right-1" : "-right-2"
                        }`}
                        style={{ fontSize: "8px" }}
                      >
                        {timeFormat(message?.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="relative ">
          {typing && (
            <div className="mr-auto -bottom-8 left-1 absolute">
              <Lottie animationData={Typing} loop className="w-20 h-12 " />
            </div>
          )}
        </div>

        <div className="h-0 relative ">
          {isRead && (
            <motion.div
              drag
              className="flex justify-end absolute -bottom-2 right-2 w-4 h-4 rounded-full overflow-hidden"
              animate={{
                x: [25, 0],
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
