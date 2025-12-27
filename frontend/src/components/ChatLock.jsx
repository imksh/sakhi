import { useState, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { MdOutlineBackspace } from "react-icons/md";
import { toast } from "react-hot-toast";
import { LuLogOut, LuSettings, LuLogIn } from "react-icons/lu";
import { useChatStore } from "../store/useChatStore";

const ChatLock = ({ user, chatId, setShow, isProtected }) => {
  const { theme, colors } = useThemeStore();
  const { setUser } = useChatStore();
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, "done", 0, "back"];

  const handleCheck = () => {
    const lock = JSON.parse(localStorage.getItem("lock"));

    if (isProtected) {
      if (!lock) {
        toast.error("Something went wrong");
        return;
      }
      if (!lock[chatId]) {
        toast.error("Passcode doesn't Exist");
        return;
      }
      if (text.toString().trim() === lock[chatId].toString().trim()) {
        setShow(false);
      } else {
        toast.error("Wrong passcode");
      }
    } else {
      let updated;
      console.log(chatId);

      if (lock) {
        lock[chatId] = text.trim();
        updated = lock;
      } else {
        updated = { [chatId]: text.toString().trim() };
      }
      console.log(updated);

      localStorage.setItem("lock", JSON.stringify(updated));

      toast.success("Chat lock enabled");
      setShow(false);
    }
  };

  const handleInput = (n) => {
    if (n === "done") {
      setUser(null);
      return;
    }
    if (n === "back") {
      if (text.length >= 4) {
        let s = text.slice(0, text.length - 1);
        setText(s);
        s = s.split("").join(" ").concat(" ");
        setInput(s + "_");
      } else if (text.length === 3) {
        let s = text.slice(0, text.length - 1);
        setText(s);
        s = s.split("").join(" ").concat(" ");
        setInput(s + "_ _");
      } else if (text.length === 2) {
        let s = text.slice(0, text.length - 1);
        setText(s);
        s = s.split("").join(" ").concat(" ");
        setInput(s + "_ _ _");
      } else {
        let s = text.slice(0, text.length - 1);
        setText(s);
        s = s.split("").join(" ").concat(" ");
        setInput("_ _ _ _");
      }
      return;
    }
    if (text.length >= 4) {
      handleCheck();
      return;
    }
    if (text.length === 3) {
      setText(text + n);
      let s = text + n;
      s = s.split("").join(" ").concat(" ");
      setInput(s);
      handleCheck();
    } else if (text.length === 2) {
      setText(text + n);
      let s = text + n;
      s = s.split("").join(" ").concat(" ");
      setInput(s + "_");
    } else if (text.length === 1) {
      setText(text + n);
      let s = text + n;
      s = s.split("").join(" ").concat(" ");
      setInput(s + "_ _");
    } else {
      setText(text + n);
      let s = text + n;
      s = s.split("").join(" ").concat(" ");
      setInput(s + "_ _ _");
    }
  };
  return (
    <div
      className={`w-full h-full absolute top-0 left-0 z-99 flex flex-col justify-center items-center`}
      style={{ backgroundColor: colors.surface }}
    >
      <div>
        <img
          src={user?.profilePic || "/images/avtar.png"}
          alt=""
          className="w-20 h-20 rounded-full"
        />
      </div>
      <div className="p-3 min-w-32 min-h-10 my-8">
        <p className="text-center tracking-wider">{input || "_ _ _ _"}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        {num.map((item) => (
          <button
            key={item}
            className=" text-2xl cursor-pointer bg-gray-400 rounded-full w-16 h-16 flex justify-center items-center text-white"
            onClick={() => handleInput(item)}
          >
            {item === "back" ? (
              <MdOutlineBackspace />
            ) : item === "done" ? (
              <LuLogOut className="rotate-y-180" />
            ) : (
              item
            )}
          </button>
        ))}
      </div>
      <div>
        <button
          className="cursor-pointer mt-5"
          onClick={() => {
            toast.success("This feature will be added soon.");
            setUser(null);
          }}
        >
          <p>Forget Passcode?</p>
        </button>
      </div>
    </div>
  );
};

export default ChatLock;
