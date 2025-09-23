import { useChatStore } from "../store/useChatStore";
import { useEffect, useState, useRef } from "react";
import styles from "./Chat.module.css";
import { useAuthStore } from "../store/useAuthStore";
import { FaFileImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { FaImage } from "react-icons/fa6";
import { NoChat } from "./NoChat";

export const Chat = () => {
  const {
    messages,
    getMessage,
    selectedUser,
    isMessageLoading,
    sendMessage,
    isSendingMessage,
  } = useChatStore();
  const [formattedMessages, setFormattedMessages] = useState([]);
  const { onlineUsers, authUser,socket } = useAuthStore();
  const [input, setInput] = useState("");
  const [imgPrev, setImgPrev] = useState(null);
  const fileInputRef = useRef();
  const textareaRef = useRef(null);
  const headerRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  useEffect(() => {
    getMessage(selectedUser._id);
  }, [getMessage, selectedUser]);

   useEffect(() => {
  if (!socket || !selectedUser) return;

  const handleNewMessage = (msg) => {
    if (msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id) {
      getMessage(selectedUser._id); 
    }
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [socket, selectedUser]);

  useEffect(() => {
    const fm = messages.map((m) => ({
      ...m,
      time: new Date(m.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    setFormattedMessages(fm);
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isSendingMessage, formattedMessages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [input]);

  if (isMessageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <NoChat name="Connecting you to your friends… 💬" />
      </div>
    );
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPrev(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImg = () => {
    setImgPrev(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const data = input;
    setInput("");
    if (!data.trim() && !imgPrev) return;
    try {
      await sendMessage({
        text: data.trim(),
        image: imgPrev,
      });
      setImgPrev(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("Failed to send message: " + error);
    }
  };

  const downloadImg = async (url) => {
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = url.split("/").pop().split("?")[0] || "download";
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };
  const showInfo = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-custom-enter" : ""
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4" onClick={() => toast.remove(t.id)}>
          <div className="flex h-30 items-center relative">
            <div className="flex-shrink-0 pt-0.5 absolute left-2">
              <img
                className="h-10 w-10 rounded-full"
                src={
                  selectedUser.profilePic?.includes("http")
                    ? selectedUser.profilePic
                    : "/images/avtar.png"
                }
                alt={selectedUser.name}
              />
            </div>
            <div className="ml-3 flex-1 absolute left-15">
              <p className="text-sm font-medium text-gray-900">
                {selectedUser.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">{selectedUser.email}</p>
              <p className="mt-1 text-sm text-gray-500">
                {selectedUser.number}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Joined on: {selectedUser.createdAt ? selectedUser.createdAt.split("T")[0] : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200 w-20">
          <button
            onClick={() => toast.remove(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };
  return (
    <div className={styles.container}>
      <div className={styles.header} ref={headerRef}>
        <button className={styles.user} onClick={showInfo}>
          <img
            src={selectedUser.profilePic || "./images/avtar.png"}
            alt={selectedUser.name}
          />
          <div className={styles.info}>
            <h2>{selectedUser.name}</h2>
            <p>
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </button>
      </div>
      <div className={styles.chat} ref={chatRef}>
        {formattedMessages.length === 0 ? (
          <NoChat name="Ready. Set. Chat. 🚀" />
        ) : (
          formattedMessages.map((message) => (
            <div
              key={message._id}
              id={message._id}
              className={
                message.receiverId === selectedUser._id
                  ? styles.right
                  : styles.left
              }
            >
              <button onClick={() => downloadImg(message.image)}>
                <div className={message.image ? styles.image : styles.hide}>
                  <img src={message.image} alt="pic" />
                </div>
              </button>
              <div className={message.text ? styles.text : styles.hide}>
                {message.text}
              </div>
              <div className={styles.time}>{message.time}</div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.sendDiv} ref={inputRef}>
        <div className={styles.imgPrevContainer}>
          {imgPrev && (
            <div className={styles.imgPrevDiv}>
              <img src={imgPrev} alt="Preview" />
              <button onClick={removeImg}>X</button>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage}>
          <input
            type="file"
            accept="image/*"
            className={`${styles.imgInput} ${
              imgPrev ? "text-[#4c91c7]" : "text-zinc-100"
            }`}
            ref={fileInputRef}
            onChange={handleImgChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className={`${styles.imgBtn} ${
              !imgPrev ? "text-zinc-400" : "text-[#4c91c7]"
            }`}
            onClick={() => fileInputRef?.current.click()}
          >
            <FaImage />
          </button>
          <textarea
            ref={textareaRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.txtInput}
            rows="1"
          />

          <button
            disabled={(!input.trim() && !imgPrev) || isSendingMessage}
            className={`${styles.submitBtn} ${
              !input.trim() && !imgPrev ? "text-zinc-400" : "text-[#4c91c7]"
            }`}
            type="submit"
          >
            {isSendingMessage ? (
              <Loader className="size-7 animate-spin" />
            ) : (
              <IoSend />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
