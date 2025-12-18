import {
  View,
  Text,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../components/HomeHeader";
import useThemeStore from "../../store/themeStore";
import { Heading, Body, Caption, Mid } from "../../components/Typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/Loading";
import { getData } from "../../utils/storage";
import { useUsersStore } from "../../store/useUsersStore";
import ScreenHeader from '../../components/ScreenHeader';

const NewChat = () => {
  const { colors, statusBarStyle } = useThemeStore();
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [listFocused, setListFocused] = useState("");
  const [input, setInput] = useState("");
  const [sorting, setSorting] = useState(true);

  const [lastMessages, setLastMessages] = useState({});
  const [sortedUsers, setSortedUsers] = useState([]);
  const [online, setOnline] = useState(false);
  const [filteredUser, setFilteredUser] = useState([]);
  const { getChatId, setUser } = useChatStore();
  const { authUser, onlineUsers, checkAuth, socket } = useAuthStore();
  const { getUser, getUsers } = useUsersStore();

  const [data, setData] = useState([]);
  useEffect(() => {
    const search = async () => {
      const users = await getUsers(input);
      setData(users || []);
    };
    search();
  }, [input]);

  const handleSearch = async () => {
    const user = await getUser(input);
    setData(user || []);
  };

  const startChat = async (user) => {
    const id = await getChatId(user);
    if (id) {
      router.push("screens/Chats");
      setUser(user);
    }
  };

  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor="white" animated />
      <ScreenHeader name="New Chat" />
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
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>

          <View className="">
            {data.map((user, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  startChat(user);
                }}
                style={{
                  padding: 16,
                  borderWidth: 0,
                  borderColor:
                    listFocused === user.name ? colors.primary : colors.border,
                  backgroundColor: listFocused === user.name && colors.primary,
                }}
                className="flex-row gap-4 items-center"
                onLongPress={() => setListFocused(user.name)}
                onBlur={() => setListFocused("")}
              >
                <View className="rounded-full">
                  <Image
                    source={
                      user.profilePic
                        ? { uri: user.profilePic }
                        : require("../../assets/images/avtar.png")
                    }
                    style={{ width: 50, height: 50 }}
                    resizeMode="contain"
                    className="rounded-full object-cover"
                  />
                  {onlineUsers?.includes(user?._id) ? (
                    <Ionicons
                      name="ellipse"
                      color={colors.success}
                      className="absolute right-0 bottom-0"
                    />
                  ) : null}
                </View>
                <View>
                  <Body style={{ color: colors.text, fontSize: 16 }}>
                    {user.name}
                  </Body>

                  {input.trim() !== "" &&
                    user?.email?.includes(input.toLowerCase()) && (
                      <Caption>{user.email}</Caption>
                    )}
                  {input.trim() !== "" &&
                    user?.number?.includes(input.toLowerCase()) && (
                      <Caption>{user.number}</Caption>
                    )}
                  {(input.trim() === "" ||
                    !user?.number?.includes(input.toLowerCase()) ||
                    !user?.number?.includes(input.toLowerCase())) &&
                    user?.name?.includes(input.toLowerCase()) && (
                      <Caption>Hello Sakhi</Caption>
                    )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default NewChat;
