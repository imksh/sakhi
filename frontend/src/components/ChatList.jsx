import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUsersStore } from "../store/useUserStore";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import NewChat from "./NewChat";
import Footer from "./Footer";

export const ChatList = () => {
  const [input, setInput] = useState("");
  const {
    initSocketListener,
    setUser,
    getChatId,
    messages,
    getUndelivered,
    getConversations,
    conversations,
  } = useChatStore();
  const { authUser, socket, onlineUsers, pushNotification } = useAuthStore();

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const { showNewChat, setShowNewChat } = useUsersStore();

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
  const timeFormat = (t) => {
    const time = new Date(t).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  };

  const startChat = async (user) => {
    const id = await getChatId(user);
    if (id) {
      setUser(user);
    }
  };

  if (showNewChat) {
    return <NewChat />;
  }

  return (
    <div className="flex flex-col h-[90dvh]">
      <div className="flex flex-row relative items-center my-4 w-full max-w-[400px] mx-auto justify-center">
        <button className="absolute left-7">
          <FaSearch size={16} />
        </button>

        <input
          placeholder="Search"
          className="w-[90%]  border rounded-2xl py-1 px-10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div
        className="flex flex-col overflow-auto h-80dvh hide-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {data?.map((chat, indx) => {
          const other = chat.members.find((m) => m._id !== authUser?._id);
          return (
            <button
              key={indx}
              className="flex py-3 px-3  gap-4 items-center"
              onClick={() => startChat(other)}
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
                  <p className="text-gray-500 text-[12px]">
                    {chat.lastMessage.length > 30
                      ? chat.lastMessage.slice(0, 27).concat("...")
                      : chat.lastMessages || "Say Hello 👋"}
                  </p>
                </div>
                <p className="text-neutral-500" style={{fontSize:10}}>{timeFormat(chat.lastMessageAt)}</p>
              </div>
            </button>
          );
        })}
        <Footer hide={true} />
      </div>

      <div>
        <button
          className="absolute bottom-8 right-4
          rounded-2xl p-3 text-white bg-blue-500"
          onClick={() => {
            setShowNewChat(!showNewChat);
          }}
        >
          <FaPlus size={20} color="white" />
        </button>
      </div>
    </div>
  );
};
