import {
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import HomeHeader from "../../components/HomeHeader";
import useThemeStore from "../../store/themeStore";
import { Heading, Body, Caption, Mid } from "../../components/Typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useUsersStore } from "../../store/useUsersStore";
import Notifications from "../../utils/Notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

const index = () => {
  const { colors, statusBarStyle } = useThemeStore();
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [listFocused, setListFocused] = useState("");
  const [input, setInput] = useState("");

  const {
    initSocketListener,
    setUser,
    messages,
    getUndelivered,
    getConversations,
    conversations,
    setChatId,
  } = useChatStore();
  const { authUser, socket, onlineUsers, pushNotification, checkAuthUser } =
    useAuthStore();
  const {} = useUsersStore();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    checkAuthUser();
  }, []);

  useEffect(() => {
    async function initPush() {
      // 1️⃣ Must be physical device
      if (!Device.isDevice) {
        console.log("Push notifications require a physical device");
        return;
      }

      // 2️⃣ Request permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permission denied");
        return;
      }

      // 3️⃣ Get token
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })
      ).data;

      console.log("Expo push token:", token);

      // 4️⃣ Send token to backend
      await pushNotification(token);

      // 5️⃣ Android channel (REQUIRED)
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }
    }

    initPush();
  }, []);

  useEffect(() => {
    setData(conversations);
  }, [conversations]);

  useEffect(() => {
    const fetch = async () => {
      await getUndelivered();
    };
    fetch();
  }, []);

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
    setChatId(chat._id);
    setUser(user);
    router.push("screens/Chats");
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

  useEffect(() => {
    if (!authUser) {
      router.replace("Login");
    }
  }, [authUser]);

  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor="white" animated />
      <HomeHeader name="Sakhi" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-1">
          <View className="flex-row relative items-center">
            <TouchableOpacity className="absolute left-10">
              <Ionicons name="search" size={24} />
            </TouchableOpacity>

            <TextInput
              placeholder="Search"
              placeholderTextColor={colors.text}
              style={{
                borderWidth: 1,
                borderColor: focused ? colors.primary : colors.border,
                borderRadius: 50,
                paddingVertical: 20,
                margin: 20,
                color: colors.text,
              }}
              className="w-[90%] pl-16 pr-8"
              value={input}
              onChangeText={setInput}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>

          <View className="">
            {data.map((chat, indx) => {
              const other = chat.members.find((m) => m._id !== authUser?._id);
              const isMine =
                chat.sender &&
                chat.sender.toString() === authUser?._id.toString();

              return (
                <TouchableOpacity
                  key={indx}
                  onPress={() => startChat(chat, other)}
                  style={{
                    padding: 16,
                    borderWidth: 0,
                  }}
                  className={`flex-row gap-4 items-center ${!isMine && !chat.read && chat.lastMessage ? "bg-blue-100" : ""}`}
                  onLongPress={() => setListFocused(other?.name)}
                  onBlur={() => setListFocused("")}
                >
                  <View className="rounded-full">
                    <Image
                      source={
                        other?.profilePic
                          ? { uri: other?.profilePic }
                          : require("../../assets/images/avtar.png")
                      }
                      style={{ width: 50, height: 50 }}
                      resizeMode="cover"
                      className="rounded-full object-cover"
                    />

                    {onlineUsers?.includes(other?._id) && (
                      <Ionicons
                        name="ellipse"
                        color={colors.success}
                        className="absolute right-0 bottom-0"
                      />
                    )}
                  </View>
                  <View className="flex-row justify-between grow">
                    <View>
                      <Body style={{ color: colors.text, fontSize: 16 }}>
                        {other?.name}
                      </Body>

                      <Caption style={{ color: colors.text }}>
                        {chat.lastMessage.length > 40
                          ? chat.lastMessage.slice(0, 35).concat("...")
                          : chat.lastMessage || "Say Hello 👋"}
                      </Caption>
                    </View>
                    <Caption style={{ color: colors.textMuted, fontSize: 10 }}>
                      {timeFormat(chat.lastMessageAt)}
                    </Caption>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity
          className="absolute bottom-10 right-10
          rounded-2xl p-4"
          style={{ backgroundColor: colors.primary, color: "white" }}
          onPress={() => router.push("screens/NewChat")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default index;
