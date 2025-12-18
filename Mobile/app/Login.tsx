import { Link, useRouter, Redirect } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Platform,
  Keyboard,
  ToastAndroid,
} from "react-native";
import { useEffect, useState } from "react";
import { Heading, Mid, Caption, Body } from "../components/Typography";
import useThemeStore from "../store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../components/Loading";
import { getData } from "../utils/storage";

export default function login() {
  const router = useRouter();
  const { colors, statusBarStyle } = useThemeStore();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { authUser, isLoggingIng, login, logout, isLoggingOut } =
    useAuthStore();
  const [isSignedin, setIsSignedin] = useState(false);
  const [hide, setHide] = useState(true);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!input.email.trim())
      return ToastAndroid.show("Email is required", ToastAndroid.SHORT);
    if (!input.password.trim())
      return ToastAndroid.show("PassWord is required", ToastAndroid.SHORT);
    if (input.password.length < 6)
      return ToastAndroid.show(
        "Password should be at least 6 character",
        ToastAndroid.SHORT
      );
    return true;
  };
  const handleSingnIn = async () => {
    const success = validateForm();
    if (!success) return;
    login(input);
  };

  useEffect(() => {
    if (authUser) {
      router.replace("(tabs)");
    }
  }, [authUser]);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={
        keyboardVisible
          ? { flex: 1, height: "25%" }
          : { flex: 1, height: "45%" }
      }
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
        animated
      />
      <View className="mt-40 justify-center w-full items-center">
        <Image
          source={require("../assets/images/logoBgRemoved.png")}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
        <Heading style={{ fontSize: 60, color: colors.primary }}>Sakhi</Heading>
        <Body>Connecting world...</Body>
      </View>
      <View className="justify-center w-full items-center">
        {/* <Image
          source={require("../assets/images/community.png")}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        /> */}
      </View>
      <View className="m-8">
        <TextInput
          className="w-[90%] mx-auto rounded-2xl p-5 my-2"
          style={{ borderColor: colors.border, borderWidth: 1 }}
          value={input.email}
          onChangeText={(text) => setInput({ ...input, email: text })}
          placeholder="Email"
          placeholderTextColor={colors.text}
          color={colors.text}
        />
        <View className="flex-row">
          <TextInput
            className="w-[90%] mx-auto rounded-2xl p-5 pr-12 my-2"
            style={{ borderColor: colors.border, borderWidth: 1 }}
            value={input.password}
            onChangeText={(text) => setInput({ ...input, password: text })}
            secureTextEntry={hide}
            placeholder="Password"
            placeholderTextColor={colors.text}
            color={colors.text}
          />
          {hide ? (
            <TouchableOpacity
              className="absolute right-8 top-[50%] -translate-y-[50%]"
              onPress={() => setHide(false)}
            >
              <Ionicons
                name={hide ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="absolute right-8 top-[50%] -translate-y-[50%]"
              onPress={() => setHide(true)}
            >
              <Ionicons
                name={hide ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          className="w-[90%] p-4 rounded-3xl flex-row justify-center items-center mx-auto mt-8"
          style={{ backgroundColor: colors.primary }}
          onPress={handleSingnIn}
        >
          {isLoggingIng ? (
            <FontAwesome5
              name="circle-notch"
              size={24}
              color="#fff"
              className="mr-4 animate-spin"
            />
          ) : (
            <Mid style={{ color: "#fff" }}>Continue</Mid>
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <Body className="mx-auto mt-4">Forgotten password?</Body>
        </TouchableOpacity>
      </View>
      <View className="mt-8">
        <TouchableOpacity
          className="w-[90%] p-4 rounded-3xl flex-row justify-center items-center mx-auto "
          style={{ borderColor: colors.primary, borderWidth: 1 }}
          onPress={() => router.push("/SignUp")}
        >
          <Mid style={{ color: colors.primary }}>Create new Account</Mid>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-0 w-full">
        <Caption className="mx-auto mb-8">Made with ❤️ ©️IdioticMinds</Caption>
      </View>
    </LinearGradient>
  );
}
