import { useEffect, useState, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { Chat } from "../components/Chat";
import { ChatList } from "../components/ChatList";
import { PhoneChat } from "../components/PhoneChat";
import { Loading } from "../components/Loading";
import { useMobileBack } from "../hooks/useMobileBack.js";
import { useUIStore } from '../store/useUIStore';

export const Home = () => {
  const { user, setUser } = useChatStore();
  const { showNewChat, setShowNewChat } = useUIStore();
  const [width, setWidth] = useState(window.innerWidth);

  const [height, setHeight] = useState(
    window.visualViewport ? window.visualViewport.height : window.innerHeight
  );

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

  useMobileBack(() => {
    if (width < 775) {
      setUser(null);
      setShowNewChat(false);
    }
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width < 775) {
    return (
      <div
        className="hide-scrollbar overflow-hidden"
        style={{ height: height }}
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
      <div className="w-[25%] min-w-[250px] mt-[10dvh] hide-scrollbar h-[90dvh] overflow-hidden">
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
