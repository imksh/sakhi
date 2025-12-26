import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useUsersStore } from "../store/useUserStore";
import { IoMdArrowRoundBack } from "react-icons/io";
import Footer from "./Footer";
import { useUIStore } from "../store/useUIStore";

const NewChat = () => {
  const [focused, setFocused] = useState(false);
  const [listFocused, setListFocused] = useState("");
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  const { getChatId, setUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { showNewChat, setShowNewChat } = useUIStore();
  const { getUser, getUsers } = useUsersStore();

  // Live search
  useEffect(() => {
    const search = async () => {
      const users = await getUsers(input);
      setData(users || []);
    };
    search();
  }, [input]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const user = await getUser(input);
    setData(user || []);
  };

  const startChat = async (user) => {
    const id = await getChatId(user);
    setShowNewChat(false);
    if (id) {
      setUser(user);
    }
  };

  return (
    <div className="h-dvh flex flex-col overflow-hiden hide-scrollbar">
      <div className="bg-blue-500 text-white px-4 h-[10dvh] flex items-center justify-between fixed top-0 left-0 w-full z-99 shrink-0 ">
        <div className="flex gap-2 items-center">
          <button onClick={() => setShowNewChat(false)}>
            <IoMdArrowRoundBack size={24} />
          </button>
          <h2 className="font-bold">Start Chat</h2>
        </div>
      </div>
      <form onSubmit={handleSearch} className="relative px-4 py-3">
        <div className="flex flex-row relative mx-auto items-center mt-3 w-full justify-center max-w-[400px]">
          <button className="absolute left-8">
            <FaSearch size={16} />
          </button>

          <input
            placeholder="Search"
            className="w-[90%] border rounded-2xl py-2 px-10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </form>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar mb-10">
        {data.map((user) => (
          <button
            key={user._id}
            onClick={() => startChat(user)}
            onContextMenu={(e) => {
              e.preventDefault();
              setListFocused(user.name);
            }}
            className={`w-full flex gap-4 items-center px-4 py-3 text-left hover:bg-blue-200`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/images/avtar.png"}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              {onlineUsers?.includes(user._id) && (
                <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full" />
              )}
            </div>

            <div>
              <p className="font-medium ">{user.name}</p>

              {input.trim() && user?.email?.includes(input.toLowerCase()) && (
                <p className="text-xs text-gray-500">{user.email}</p>
              )}

              {input.trim() && user?.number?.includes(input.toLowerCase()) && (
                <p className="text-xs text-gray-500">{user.number}</p>
              )}

              {(!input.trim() ||
                user?.name?.toLowerCase().includes(input.toLowerCase())) && (
                <p className="text-xs text-gray-400">Hello Sakhi</p>
              )}
            </div>
          </button>
        ))}
        <Footer hide={true} />
      </div>
    </div>
  );
};

export default NewChat;
