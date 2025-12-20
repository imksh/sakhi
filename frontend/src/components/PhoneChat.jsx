import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loading } from "./Loading";
import Lottie from "lottie-react";
import heart from "../assets/animations/heart.json";
import { IoMdArrowRoundBack } from "react-icons/io";
import InputMessage from "./InputMessage";
import { ImagePreview } from "./ImagePreview";

export const PhoneChat = () => {
  const [text, setText] = useState("");
  const { messages, chatId, sendMessage, user, setUser } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const [imgPrev, setImgPrev] = useState(null);
  const fileInputRef = useRef(null);
  const divRef = useRef(null);
  const [data, setData] = useState([]);
  const [height, setHeight] = useState(
    window.visualViewport ? window.visualViewport.height : window.innerHeight
  );

  const scrollRef = useRef();

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
  }, [data, height]);

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
      if (!data.trim() && !img) {
        m = await sendMessage({
          text: "❤️",
          image: img,
          chatId: chatId._id,
          sender: authUser._id,
        });
      } else {
        m = await sendMessage({
          text: data.trim(),
          image: img,
          chatId: chatId._id,
          sender: authUser._id,
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
                <p style={{ fontSize: "9px" }}>Offline</p>
              )}
            </div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 flex flex-col grow hide-scrollbar"
        >
          {data.length === 0 ? (
            <Loading name="No Chat History" />
          ) : (
            data.map((message, idx) => {
              const isSelf = String(message?.sender) === String(authUser?._id);

              return (
                <div
                  key={message?._id || idx}
                  className={`max-w-[75%] my-1 rounded-lg ${
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
                >
                  {/* Image */}
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
                    <p
                      className=" text-right text-gray-600 mt-1"
                      style={{ fontSize: "8px" }}
                    >
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
