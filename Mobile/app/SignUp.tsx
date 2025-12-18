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
import { className } from "../node_modules/@sinonjs/commons/types/index.d";
import { useAuthStore } from "../store/useAuthStore";

export default function SignUp() {
  const isSignedIn = false;
  const router = useRouter();
  const { colors, statusBarStyle } = useThemeStore();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [pass, setPass] = useState("");
  const [hide, setHide] = useState(true);
  const [verify, setVerify] = useState(false);
  const [otp, setOtp] = useState("");
  const { verifyEmail, signup, isSigningUp, authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      router.replace("(tabs)");
    }
  }, [authUser]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (time === 0) return;
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  const sendOtp = async () => {
    setLoading(true);
    try {
      if (!validate()) return;
      await verifyEmail(input);
    } catch (error) {}
    setVerify(true);
    setTime(59);
    setLoading(false);
  };

  const validate = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.email === "" || input.name === "" || input.password === "") {
      ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
      setLoading(false);
      return false;
    }
    if (input.password.length < 6) {
      ToastAndroid.show(
        "Password length should be atleast 6 ",
        ToastAndroid.SHORT
      );
      setLoading(false);
      return false;
    }
    if (!pattern.test(input.email)) {
      ToastAndroid.show("Invalid Email", ToastAndroid.SHORT);
      setLoading(false);
      return false;
    }

    if (input.password !== pass) {
      ToastAndroid.show("Password should match", ToastAndroid.SHORT);
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    try {
      const data = { ...input, otp: otp };
      const flag = signup(data);
      if(flag){
        router.push("Login");
      }
    } catch (error) {}
  };

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

      <View className="mt-10 w-full flex-row items-center p-5">
        <Image
          source={require("../assets/images/logoBgRemoved.png")}
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
          className="mr-4"
        />
        <Heading style={{ fontSize: 26, color: colors.primary }}>Sakhi</Heading>
      </View>
      {verify ? (
        <View>
          <Heading className="mb-4 mx-auto">Verify OTP</Heading>
          <TextInput
            className="w-[90%] mx-auto rounded-2xl p-5 my-2"
            style={{ borderColor: colors.border, borderWidth: 1 }}
            value={otp}
            onChangeText={setOtp}
            placeholder="OTP"
            placeholderTextColor={colors.text}
            color={colors.text}
          />
          <View className="mx-auto flex-row items-center justify-center">
            <Caption>Resend otp in {time} seconds </Caption>
            {time === 0 && (
              <TouchableOpacity onPress={sendOtp}>
                <Caption style={{ color: colors.text }} className="underline">
                  Resend
                </Caption>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            className="w-[90%] p-4 rounded-3xl flex-row justify-center items-center mx-auto mt-8"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSignup}
          >
            {isSigningUp ? (
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
          <TouchableOpacity onPress={() => setVerify(false)}>
            <Body className="mx-auto mt-4">Change Email</Body>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="m-8">
          <Heading className="mb-4 mx-auto">Create a new Account</Heading>
          <TextInput
            className="w-[90%] mx-auto rounded-2xl p-5 my-2"
            style={{ borderColor: colors.border, borderWidth: 1 }}
            value={input.name}
            onChangeText={(text) => setInput({ ...input, name: text })}
            placeholder="Name"
            placeholderTextColor={colors.text}
            color={colors.text}
          />
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

          <TextInput
            className="w-[90%] mx-auto rounded-2xl p-5 my-2"
            style={
              input.password !== pass && pass !== ""
                ? { borderColor: colors.danger, borderWidth: 1 }
                : { borderColor: colors.border, borderWidth: 1 }
            }
            value={pass}
            onChangeText={setPass}
            secureTextEntry={true}
            placeholder="Confirm Password"
            placeholderTextColor={colors.text}
            color={colors.text}
          />
          <TouchableOpacity
            className="w-[90%] p-4 rounded-3xl flex-row justify-center items-center mx-auto mt-8"
            style={{ backgroundColor: colors.primary }}
            onPress={sendOtp}
          >
            {isSigningUp ? (
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
            <Caption className="mx-auto mt-4">
              By continuing you agree to our terms and conditions
            </Caption>
          </TouchableOpacity>
        </View>
      )}
      <View className="mt-8">
        <TouchableOpacity
          className="w-[90%] p-4 rounded-3xl flex-row justify-center items-center mx-auto "
          style={{ borderColor: colors.primary, borderWidth: 1 }}
          onPress={() => router.push("/Login")}
        >
          <Mid style={{ color: colors.primary }}>Already have an Account</Mid>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-0 w-full">
        <Caption className="mx-auto mb-8">Made with ❤️ ©️IdioticMinds</Caption>
      </View>
    </LinearGradient>
  );
}
