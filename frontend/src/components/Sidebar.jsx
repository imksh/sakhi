import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUsersStore } from "../store/useUserStore";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import NewChat from "./NewChat";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import { useUIStore } from "../store/useUIStore";

export const Sidebar = () => {
  const [input, setInput] = useState("");
  const {
    initSocketListener,
    setUser,
    getChatId,
    messages,
    getUndelivered,
    getConversations,
    conversations,
    user,
    setChatId,
    isConversationLoading,
    isMessageLoading,
  } = useChatStore();
  const { authUser, socket, onlineUsers } = useAuthStore();
  const { showNewChat, setShowNewChat } = useUIStore();

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setData(conversations);
  }, [conversations]);

  useEffect(() => {
    if (socket && authUser) {
      initSocketListener(socket, authUser);
    }
  }, [socket, authUser]);

  useEffect(() => {
    const load = async () => {
      const list = await getConversations();

      setData(list || []);

      const others = (list || []).map((chat) =>
        chat.members.find((m) => m._id !== authUser?._id)
      );
      setUsers(others || []);
    };
    load();
  }, [messages]);

  const startChat = async (chat, user) => {
    setChatId(chat);
    if (chat?._id) {
      setUser(user);
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

  

  if (showNewChat) {
    return <NewChat />;
  }

  if (isConversationLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Footer hide={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="flex flex-row relative mx-auto items-center my-4 w-full justify-center">
        <button className="absolute left-8">
          <FaSearch size={16} />
        </button>

        <input
          placeholder="Search"
          className="w-[90%] border rounded-2xl py-2 px-10 outline-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="flex flex-col overflow-auto hide-scrollbar">
        <button
          className={`flex py-3 px-3  gap-4 items-center`}
          onClick={() => navigate("/ai")}
        >
          <Lottie animationData={infinity} loop className="w-10 h-10" />
          <div className="flex flex-col items-baseline">
            <p className="font-bold">SakhiAI</p>
            <p className="text-gray-500 text-[12px]">Chat with AI Sakhi</p>
          </div>
        </button>
        {data?.map((chat, indx) => {
          const other = chat.members.find((m) => m._id !== authUser?._id);
          const isMine =
            chat.sender && chat.sender.toString() === authUser?._id.toString();
          const unread = !isMine && !chat.read && chat.lastMessage;
          return (
            <button
              key={indx}
              className={`flex py-3 px-3  gap-4 items-center ${
                other?._id === user?._id ? "bg-green-200 text-black" : ""
              } ${unread ? "bg-blue-200 text-black" : ""}`}
              onClick={() => startChat(chat, other)}
            >
              <div className="rounded-full relative">
                <img
                  src={other?.profilePic || "/images/avtar.png"}
                  alt=""
                  className="rounded-full object-cover w-10 h-10"
                />

                {onlineUsers?.includes(other?._id) && (
                  <GoDotFill className="absolute right-0 bottom-0 text-green-500" />
                )}
              </div>
              <div className="flex justify-between grow">
                <div className="flex flex-col items-baseline ">
                  <p>{other?.name || "Unknown User"}</p>
                  <p className="text-gray-500 text-[12px] flex items-center text-start ">
                    {chat.lastMessage.length > 28
                      ? chat.lastMessage.slice(0, 25).concat("...")
                      : chat.lastMessage || "Say Hello 👋"}
                  </p>
                </div>
                <div className="min-w-11 flex flex-col items-center relative">
                  <p className="text-[10px] min-w-11 ">
                    {timeFormat(chat.lastMessageAt)}
                  </p>
                  {unread && (
                    <GoDotFill className=" right-3 bottom-1 text-green-500 md:w-5 md:h-5  absolute" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {/* <Footer hide={true} /> */}
      </div>

      <div
        className="absolute bottom-6 left-4
          rounded-2xl p-2 text-white bg-blue-500"
      >
        <NavLink to="/profile">
          {({ isActive }) => (
            <span className="">
              <img
                src={authUser.profilePic || "./images/avtar.png"}
                alt={authUser.name}
                className="w-10 h-10  rounded-full object-cover"
              />
            </span>
          )}
        </NavLink>
      </div>

      <div>
        <button
          className="absolute bottom-8 right-4
          rounded-2xl p-3 text-white bg-blue-500"
          onClick={() => setShowNewChat(!showNewChat)}
        >
          <FaPlus size={20} color="white" />
        </button>
      </div>
    </div>
  );
};
