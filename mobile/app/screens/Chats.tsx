import {
  View,
  Text,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import ChatsHeader from "../../components/ChatsHeader";
import useThemeStore from "../../store/themeStore";
import InputMessage from "../../components/InputMessage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import useKeyboardVisible from "../../hooks/useKeyboardVisible";

import { useRouter, useLocalSearchParams } from "expo-router";
import { getData, save } from "../../utils/storage";

const Chats = () => {
  const { colors, statusBarStyle } = useThemeStore();
  const [text, setText] = useState("");
  const keyboardVisible = useKeyboardVisible();
  const router = useRouter();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const {
    getMessages,
    isClearingMsg,
    user,
    chatId,
    messages,
    sendMessage,
    setConversations,
    conversations,
    readChat,
  } = useChatStore();
  const { onlineUsers, authUser, socket } = useAuthStore();
  const [imgPrev, setImgPrev] = useState(null);
  const fileInputRef = useRef();
  const scrollViewRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fun = async () => {
      const chat = conversations.find((i) => i._id.toString() === chatId);
      if (user?._id?.toString() === chat?.sender?.toString() && !chat?.read) {
        await readChat(chat);
      }
    };
    fun();
  }, [chatId]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, [keyboardVisible, size.height, messages, data]);

  useEffect(() => {
    const load = async () => {
      const m = await getData(chatId);
      setData(m || []);
    };
    load();
  }, [chatId]);

  useEffect(() => {
    const cached = messages[chatId];
    if (cached) {
      setData(cached);
    }
  }, [messages, chatId]);

  const handleSendMessage = async () => {
    const data = text;
    setText("");

    try {
      let m;
      if (!data.trim()) {
        m = await sendMessage({
          text: "❤️",
          image: imgPrev,
          chatId: chatId,
          sender: authUser,
          createdAt: new Date(),
        });
      } else {
        m = await sendMessage({
          text: data.trim(),
          image: imgPrev,
          chatId: chatId,
          sender: authUser,
          createdAt: new Date(),
        });
      }
      setData((prev) => [...prev, m] || []);
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
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
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
        <ChatsHeader user={user} />

        <ScrollView
          style={{ flex: 1, backgroundColor: colors.surface }}
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 10, paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          {data?.length === 0 ? (
            <Loading />
          ) : isClearingMsg ? (
            <Loading name="Wiping chats clean… ✨" />
          ) : (
            data?.map((message, indx) => (
              <TouchableOpacity
                key={message?._id || indx}
                className={`max-w-[75%] rounded-lg my-1 ${message?.image ? "p-1" : " px-3 py-2"} ${
                  message?.sender?._id === authUser?._id
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
    </View>
  );
};

export default Chats;
