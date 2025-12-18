import { useEffect, useState, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { Chat } from "../components/Chat";
import { ChatList } from "../components/ChatList";
import { PhoneChat } from "../components/PhoneChat";
import { useThemeStore } from "../store/useThemeStore";
import { Loading } from "../components/Loading";
import { useMobileBack } from "../hooks/useMobileBack.js";

export const Home = () => {
  const { user, setUser, setShowNewChat } = useChatStore();
  const { theme, setTheme } = useThemeStore();
  const [width, setWidth] = useState(window.innerWidth);
  const [diff, setDiff] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const initialHeight = useRef(window.innerHeight);

  useMobileBack(() => {
    if (width < 775) {
      setUser(null);
      setShowNewChat(false);
    }
  });

  useEffect(() => {
    const onResize = () => {
      setKeyboardOpen(window.innerHeight < initialHeight.current);
      if (window.innerHeight < initialHeight.current) {
        setDiff(Math.abs(window.innerHeight - initialHeight.current));
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width < 775) {
    return (
      <div
        className="hide-scrollbar overflow-hidden"
        style={
          keyboardOpen ? { height: "100dvh" } : { height: initialHeight - diff }
        }
      >
        {user === null ? (
          <div className="pt-[10dvh]">
            <ChatList />
          </div>
        ) : (
          <div className="">{<PhoneChat />}</div>
        )}
      </div>
    );
  }
  return (
    <div className="flex hide-scrollbar">
      <div
        className="w-[25%] min-w-[250px] mt-[10dvh] hide-scrollbar h-[90dvh] overflow-hidden"
        style={{ backgroundColor: theme }}
      >
        <Sidebar />
      </div>
      <div className="w-[75%]  overflow-hidden h-[100dvh] z-99 shadow border-l border-neutral-300">
        {user != null ? (
          <Chat />
        ) : (
          <Loading
            name="Select a friend to start chatting 💬"
            className="m-auto"
          />
        )}
      </div>
    </div>
  );
};
