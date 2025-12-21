import {
  View,
  Text,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Pressable,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import ChatsHeader from "../../components/ChatsHeader";
import useThemeStore from "../../store/themeStore";
import InputMessage from "../../components/InputMessage";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import useKeyboardVisible from "../../hooks/useKeyboardVisible";
import Typing from "../../assets/animations/typing.json";

import { useRouter } from "expo-router";
import { MotiView } from "moti";
import LottieView from "lottie-react-native";
import { useUIStore } from "../../store/useUIStore";

import { Body } from "../../components/Typography";
import useKeyboardHeight from "../../hooks/useKeyboardHeight";

const Chats = () => {
  const { colors, statusBarStyle, theme } = useThemeStore();
  const [text, setText] = useState("");
  const keyboardVisible = useKeyboardVisible();
  const router = useRouter();
  const [size, setSize] = useState({ width: 0, height: 0 });
  // const keyboardHeight = useKeyboardHeight();
  // const { height } = useWindowDimensions();
  const {
    isClearingMsg,
    user,
    chatId,
    messages,
    sendMessage,
    conversations,
    readChat,
  } = useChatStore();
  const { onlineUsers, authUser, socket } = useAuthStore();
  const [imgPrev, setImgPrev] = useState(null);

  const fileInputRef = useRef();
  const scrollViewRef = useRef();
  const [isRead, setIsRead] = useState(false);
  const [data, setData] = useState([]);
  const [typing, setTyping] = useState(false);
  const { showOption, showMsgOption, setShowOption, setShowMsgOption } =
    useUIStore();
  //Read initail status
  useEffect(() => {
    if (!chatId || !authUser?._id) return;

    const chat = conversations.find((i) => i._id.toString() === chatId);
    if (!chat) return;

    if (chat.sender?.toString() === authUser._id.toString()) {
      setIsRead(chat.read);
    } else {
      setIsRead(true);
    }
  }, []);

  //Read socket Recieve
  useEffect(() => {
    if (!socket) return;

    const handleReadMessage = ({ chatId: readChatId }) => {
      if (readChatId === chatId) {
        setIsRead(true);
      }
    };

    socket.on("readMessage", handleReadMessage);
    return () => socket.off("readMessage", handleReadMessage);
  }, [socket, chatId]);

  //Read Socket Send
  useEffect(() => {
    if (!socket || !chatId || !authUser?._id) return;
    if (authUser._id === user?._id) return;
    if (!data.length) return;

    socket.emit("markAsRead", {
      chatId: chatId,
      senderId: user._id,
    });
  }, [socket, chatId, data.length]);

  //Typing Socket Recieve
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ status, chatId: readChatId }) => {
      if (readChatId === chatId) {
        setTyping(status);
      }
    };

    socket.on("handleTyping", handleTyping);
    return () => socket.off("handleTyping", handleTyping);
  }, [socket, chatId]);

  //read api send
  useEffect(() => {
    const fun = async () => {
      const chat = conversations.find((i) => i._id.toString() === chatId);
      if (user?._id?.toString() === chat?.sender?.toString() && !chat?.read) {
        await readChat(chat);
      }
    };
    fun();
  }, [chatId, conversations, user, readChat]);

  //scroll

  // useEffect(() => {
  //   scrollViewRef.current?.scrollToEnd({ animated: false });
  // }, []);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [keyboardVisible, size.height, messages, data]);

  useEffect(() => {
    const cached = messages[chatId];
    if (cached) {
      setData(cached);
    }
  }, [messages, chatId]);

  const handleSendMessage = async () => {
    const data = text;
    const image = imgPrev;
    setImgPrev(null);
    setText("");

    try {
      let m;
      setIsRead(false);
      let msg;
      if (!data.trim() && !image) {
        msg = {
          text: "❤️",
          image: image,
          chatId: chatId,
          sender: authUser._id,
          createdAt: new Date(),
        };
        m = await sendMessage(msg);
      } else {
        msg = {
          text: data.trim(),
          image: image,
          chatId: chatId,
          sender: authUser._id,
          createdAt: new Date(),
        };
        m = await sendMessage(msg);
      }
      setData((prev) => [...prev, msg] || []);
      setImgPrev(null);
    } catch (error) {
      console.log("Failed to send message: " + error);
    }
  };

  const timeFormat = (t) => {
    if (!t) return "";
    const time = new Date(t).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  };

  return (
    <Pressable
      style={{ flex: 1, backgroundColor: colors.surface }}
      onPress={() => {
        setShowOption(false);
        setShowMsgOption(false);
      }}
    >
      <StatusBar barStyle={statusBarStyle} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -30}
        style={
          keyboardVisible
            ? { flex: 1, paddingBottom: 30 }
            : { flex: 1, paddingBottom: 10 }
        }
      >
        <ChatsHeader user={user} onlineUsers={onlineUsers} typing={typing} />
        <View className="relative">
          {showOption && (
            <View
              className={`absolute top-[10dvh] right-0  ${
                theme === "light"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }  rounded-l-2xl  py-2  border  text-[12px] w-[15vw] min-w-[200px] flex flex-col items-baseline z-40`}
              style={
                theme === "light"
                  ? { borderWidth: 1.5, borderColor: "#D1D5DB" }
                  : { borderWidth: 1.5, borderColor: "#6B7280" }
              }
            >
              <TouchableOpacity
                className="w-full rounded-xl py-3 pl-6 flex justify-baseline "
                onPress={() => {
                  ToastAndroid.show(
                    "This Feature will be added Soon",
                    ToastAndroid.SHORT
                  );
                  setShowOption(false);
                }}
              >
                <Body>View Profile</Body>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-full rounded-xl py-3 pl-6 flex justify-baseline "
                onPress={() => {
                  ToastAndroid.show(
                    "This Feature will be added Soon",
                    ToastAndroid.SHORT
                  );
                  setShowOption(false);
                }}
              >
                <Body>Clear Chat</Body>
              </TouchableOpacity>
              <View
                className={`border w-full my-2`}
                style={
                  theme === "light"
                    ? { borderWidth: 0.5, borderColor: "#D1D5DB" }
                    : { borderWidth: 0.5, borderColor: "#6B7280" }
                }
              ></View>
              <TouchableOpacity
                className="w-full rounded-xl py-3 pl-6 flex justify-baseline "
                onPress={() => {
                  ToastAndroid.show(
                    "This Feature will be added Soon",
                    ToastAndroid.SHORT
                  );
                  setShowOption(false);
                }}
              >
                <Body>Block</Body>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          style={{ flex: 1, backgroundColor: colors.surface }}
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 10, paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          {data?.length === 0 ? (
            <Loading />
          ) : (
            data?.map((message, indx) => (
              <TouchableOpacity
                key={message?._id || indx}
                className={`max-w-[75%] rounded-lg my-1 ${message?.image ? "p-1" : " px-3 py-2"} ${
                  message?.sender.toString() === authUser?._id.toString()
                    ? "self-end bg-green-200"
                    : "self-start bg-gray-200"
                }  `}
                style={message?.text === "❤️" && { backgroundColor: "inherit" }}
              >
                {message?.image ? (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "screens/ImageViewScreen",
                        params: { uri: message?.image },
                      })
                    }
                  >
                    <Image
                      source={{ uri: message?.image }}
                      style={{ width: 200, height: 280, borderRadius: 5 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : null}
                <Text
                  className={
                    message?.text
                      ? ` ${message?.text === "❤️" && "text-5xl"}`
                      : "hidden"
                  }
                >
                  {message?.text}
                </Text>
                <Text
                  className={`text-[10px] self-end mt-1 text-gray-600 ${message?.image && " absolute bottom-0 p-4"} ${message?.text === "❤️" && "hidden"}`}
                >
                  {timeFormat(message?.createdAt)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View className="relative ">
          {typing && (
            <View className=" absolute -bottom-6 left-1">
              <LottieView
                source={Typing}
                autoPlay
                loop
                style={{ width: 50, height: 50 }}
              />
            </View>
          )}
        </View>
        <View className="h-0 relative ">
          {isRead && (
            <MotiView
              className="flex justify-end absolute  bottom-0 right-3 w-4 h-4 rounded-full overflow-hidden"
              animate={{ x: [25, 0] }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* <View className="bg-white/0  top-0 left-0 w-full h-full"></View> */}
              <Image
                source={
                  user?.profilePic
                    ? { uri: user?.profilePic }
                    : require("../../assets/images/avtar.png")
                }
                resizeMode="cover"
                className="w-4 h-4 rounded-full ml-auto "
              />
            </MotiView>
          )}
        </View>

        <View style={{ paddingBottom: 0 }}>
          <InputMessage
            text={text}
            setText={setText}
            imgPrev={imgPrev}
            send={handleSendMessage}
            fileInputRef={fileInputRef}
            setImgPrev={setImgPrev}
            size={size}
            setSize={setSize}
          />
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
};

export default Chats;
