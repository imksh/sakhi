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
import { MotiView } from "moti";
import useKeyboardVisible from "../hooks/useKeyboardVisible";

export default function login() {
  const router = useRouter();
  const { colors, statusBarStyle } = useThemeStore();
  const { authUser, isLoggingIng, login, logout, isLoggingOut } =
    useAuthStore();
  const [isSignedin, setIsSignedin] = useState(false);
  const [hide, setHide] = useState(true);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const keyboardVisible = useKeyboardVisible();

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
      <View
        className={`${keyboardVisible ? "mt-24" : "mt-40"} justify-center w-full items-center`}
      >
        <Image
          source={require("../assets/images/logoBgRemoved.png")}
          style={
            !keyboardVisible
              ? { width: 100, height: 100 }
              : { width: 80, height: 80 }
          }
          resizeMode="contain"
          className="animate-bounce"
        />
        <View className="relative">
          {keyboardVisible && (
            <MotiView
              from={{
                translateX: -15,
                translateY: 15,
                opacity: 1,
                rotate: "50deg",
              }}
              animate={{
                translateX: 25,
                translateY: -35,
                opacity: 0,
                rotate: "0deg",
              }}
              transition={{
                type: "timing",
                duration: 1500,
              }}
              className="absolute z-20"
            >
              <FontAwesome5
                name="telegram-plane"
                size={20}
                color={colors.text}
              />
            </MotiView>
          )}
          <Heading
            style={
              keyboardVisible
                ? { fontSize: 45, color: colors.primary }
                : { fontSize: 60, color: colors.primary }
            }
          >
            Sakhi
          </Heading>
        </View>
        <Body>Sakhi — A friend in every chat</Body>
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
          className="w-[100%] mx-auto rounded-2xl p-5 my-2"
          style={{ borderColor: colors.border, borderWidth: 1 }}
          value={input.email}
          onChangeText={(text) => setInput({ ...input, email: text })}
          placeholder="Email"
          placeholderTextColor={colors.text}
          color={colors.text}
        />
        <View className="flex-row">
          <TextInput
            className="w-[100%] mx-auto rounded-2xl p-5 pr-12 my-2"
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
