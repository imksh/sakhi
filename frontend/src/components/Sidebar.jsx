import { useState } from "react";
import styles from "./Sidebar.module.css";
import { useChatStore } from "../store/useChatStore";
import { FaSearch } from "react-icons/fa";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { MdVerified } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import {toast}from "react-hot-toast"

export const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [sortedUsers, setSortedUsers] = useState([]);
  const [online, setOnline] = useState(false);
  const [filteredUser, setFilteredUser] = useState([]);
  const { theme } = useThemeStore();
  const {
    users,
    allUsers,
    getAllUsers,
    getUsers,
    selectedUser,
    setSelectedUser,
    isUserLoading,
    getMsg,
    messages,
    getMessage,
    isMessageLoading,
  } = useChatStore();
  const { authUser, onlineUsers, checkAuth,socket } = useAuthStore();
  useEffect(() => {
    getUsers();
    getAllUsers();
    checkAuth();
  }, [getUsers, getAllUsers]);

   useEffect(() => {
    if (isMessageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <NoChat name="Connecting you to your friends… 💬" />
      </div>
    );
  }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if(msg.senderId._id!=selectedUser._id) toast(`${msg.senderId.name}: ${msg.text}`);

      getMessage(selectedUser._id); 
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  
  useEffect(() => {
    if (!users || users.length === 0) return;

    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const user = users.find((u) => u._id === parsedUser._id);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, []);

  useEffect(() => {
    if (online) {
      setFilteredUser(users.filter((u) => onlineUsers.includes(u._id)));
      return;
    }
    if (!search.trim()) {
      setFilteredUser(users);
      return;
    }

    const lowerSearch = search.toLowerCase();
    setFilteredUser([
      ...users.filter(
        (u) =>
          u.name?.toLowerCase().includes(lowerSearch) ||
          u.email?.toLowerCase().includes(lowerSearch) ||
          u.number?.toString().includes(lowerSearch)
      ),
      ...allUsers.filter(
        (user) =>
          user.email?.toLowerCase() === lowerSearch ||
          user.number?.toString() === lowerSearch
      ),
    ]);
  }, [search, users, allUsers, online, onlineUsers]);

  useEffect(() => {
    const fetchLastMessages = async () => {
      const lastMsgs = {};

      await Promise.all(
        filteredUser.map(async (user) => {
          if (!authUser.contacts.includes(user._id)) return;

          let msg = await getMsg(authUser._id, user._id);

          if (msg?.text) {
            msg = {
              ...msg,
              text:
                msg.text.length > 15
                  ? msg.text.substring(0, 15) + "..."
                  : msg.text,
            };
          } else if (msg?.image) {
            msg = { ...msg, text: "Image" };
          }

          lastMsgs[user._id] = msg;
        })
      );

      setLastMessages(lastMsgs);
    };

    fetchLastMessages();
  }, [filteredUser, authUser, getMsg, messages]);

  useEffect(() => {
    if (!filteredUser || filteredUser.length === 0) {
      setSortedUsers([]);
      return;
    }

    if (!lastMessages) {
      setSortedUsers(filteredUser);
      return;
    }

    const updatedUsers = filteredUser.map((u) => ({
      ...u,
      time: lastMessages[u._id]?.createdAt || 0,
    }));
    updatedUsers.sort((a, b) => new Date(b.time) - new Date(a.time));
    setSortedUsers(updatedUsers);
  }, [filteredUser, lastMessages]);

  if (isUserLoading || !authUser || !authUser.contacts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar} style={{ backgroundColor: theme }}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.online}>
        <label>
          <input
            type="radio"
            name="status"
            value={false}
            checked={!online}
            onChange={() => setOnline(false)}
          />
          All
        </label>

        <label>
          <input
            type="radio"
            name="status"
            value={true}
            checked={online}
            onChange={() => setOnline(true)}
          />
          Online
        </label>
      </div>
      <div className={styles.chats}>
        {sortedUsers.map((user) => (
          <button
            key={user._id}
            className={`${styles.list}`}
            onClick={() => {
              setSelectedUser(user);
              localStorage.setItem(
                "selectedUser",
                JSON.stringify({ _id: user._id })
              );
            }}
            style={
              selectedUser?._id === user._id
                ? theme == "dark"
                  ? { backgroundColor: "#3a3c3c" }
                  : { backgroundColor: "#8F8F8F" }
                : {}
            }
          >
            <div className={styles.imgDiv}>
              <img
                src={user.profilePic || "./images/avtar.png"}
                alt={user.name}
              />
              {onlineUsers?.includes(user._id) ? (
                <GoDotFill className={styles.dot} />
              ) : null}
            </div>
            <div className={styles.info}>
              <h2 className="flex justify-center items-center">
                {user.name}{" "}
                {user._id === "68d1dbf912b5032d01693def" && (
                  <MdVerified className="text-[#4c91c7]" />
                )}
              </h2>
              <p>
                {!authUser?.contacts.includes(user._id)
                  ? user._id === "68d1dbf912b5032d01693def"
                    ? "Contact Official"
                    : "Start Chatting"
                  : lastMessages[user._id]?.text || "Start Chatting"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
