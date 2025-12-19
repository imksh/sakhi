import {
  View,
  Text,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import useThemeStore from "../../store/themeStore";
import Loading from "../../components/Loading";
import useKeyboardVisible from "../../hooks/useKeyboardVisible";

import { useRouter } from "expo-router";
import { getData, save, remove } from "../../utils/storage";
import { api } from "../../utils/axios";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Heading } from "../../components/Typography";

import infinity from "../../assets/animations/infinity.json";
import LottieView from "lottie-react-native";
import { MotiView } from "moti";
import ConfirmationToast from "../../components/ConfirmationToast";

const AI = () => {
  const { colors, statusBarStyle } = useThemeStore();
  const [text, setText] = useState("");
  const keyboardVisible = useKeyboardVisible();
  const router = useRouter();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const scrollViewRef = useRef();
  const [data, setData] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const inputRef = useRef(null);
  const [showClearChat, setShowClearChat] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, [keyboardVisible, size.height, data]);

  useEffect(() => {
    const load = async () => {
      const m = await getData("ai");
      setData(m || []);
    };
    load();
  }, []);

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const userText = text;
    setText("");

    const userMsg = {
      sender: "user",
      text: userText,
      time: new Date(),
    };

    setData((prev) => {
      const updated = [...prev, userMsg];
      save("ai", updated); // ✅ save correct data
      return updated;
    });

    try {
      setIsWaiting(true);

      const res = await api.post("/ai/chat", {
        message: userText,
      });

      const aiMsg = {
        sender: "ai",
        text: res.data.reply,
        time: new Date(),
      };

      setData((prev) => {
        const updated = [...prev, aiMsg];
        save("ai", updated); // ✅ save again
        return updated;
      });
    } catch (error) {
      console.error("Failed to send message:", error);

      setData((prev) => {
        const updated = [
          ...prev,
          { sender: "ai", text: "Something went wrong.", time: new Date() },
        ];
        save("ai", updated);
        return updated;
      });
    } finally {
      setIsWaiting(false);
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

  const clearChat = async () => {
    setData([]);
    await remove("ai");
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <StatusBar barStyle={statusBarStyle} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : -30}
          style={keyboardVisible ? { flex: 1, paddingBottom: 30 } : { flex: 1 }}
        >
          <View
            className="pt-16 px-4 pb-4 flex-row items-center justify-between"
            style={{ backgroundColor: colors.bg, elevation: 2 }}
          >
            <View className="flex-row items-center ml-4">
              <LottieView
                source={infinity}
                autoPlay
                loop
                style={{ width: 40, height: 40 }}
              />
              <Heading className="ml-4" style={{ color: colors.primary }}>
                SakhiAI
              </Heading>
            </View>
            <TouchableOpacity onPress={() => setShowClearChat(!showClearChat)}>
              <Ionicons
                name="ellipsis-vertical-outline"
                color={colors.text}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1, backgroundColor: colors.surface }}
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 10, paddingBottom: 0 }}
            keyboardShouldPersistTaps="handled"
          >
            {data?.length === 0 ? (
              <View className="justify-center items-center m-auto w-full min-h-full ">
                <LottieView
                  source={infinity}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
                />
              </View>
            ) : (
              data?.map((message, indx) => (
                <TouchableOpacity
                  key={message?._id || indx}
                  className={`max-w-[75%] rounded-lg my-1 ${message?.image ? "p-1" : " px-3 py-2"} ${
                    message?.sender === "user"
                      ? "self-end bg-green-200"
                      : "self-start bg-gray-200"
                  }  `}
                >
                  <Text>{message?.text}</Text>
                  <Text className={`text-[10px] self-end mt-1 text-gray-600`}>
                    {timeFormat(message?.time)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <View className="flex-row items-end p-2">
            <View
              className="flex-1 flex-row items-end bg-gray-100 rounded-2xl px-3 py-2"
              ref={inputRef}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setSize({ width, height });
              }}
            >
              <TextInput
                multiline
                value={text}
                onChangeText={setText}
                placeholder="Message"
                style={{ maxHeight: 150 }}
                className="flex-1 px-2 text-base"
              />
            </View>

            <TouchableOpacity
              className="ml-2 rounded-full p-3 mb-2 min-w-14 min-h-14 flex justify-center items-center overflow-hidden"
              style={{ backgroundColor: colors.primary }}
              onPress={handleSendMessage}
              disabled={isWaiting}
            >
              {text.length === 0 ? (
                <FontAwesome5 name="telegram-plane" size={24} color="#fff" />
              ) : (
                <MotiView
                  from={{
                    translateX: -15,
                    translateY: 15,
                    rotate: "50deg",
                  }}
                  animate={{
                    translateX: 0,
                    translateY: 0,
                    rotate: "0deg",
                  }}
                  transition={{
                    type: "timing",
                    duration: 800,
                  }}
                >
                  <FontAwesome5 name="telegram-plane" size={24} color="#fff" />
                </MotiView>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      {showClearChat && (
        <ConfirmationToast
          name="Clear Chat"
          icon="trash-outline"
          fun={clearChat}
          message="Are you sure you want to clear chat history?"
          setShow={setShowClearChat}
        />
      )}
    </>
  );
};

export default AI;
