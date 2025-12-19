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
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import HomeHeader from "../../components/HomeHeader";
import useThemeStore from "../../store/themeStore";
import { Heading, Mid, Body, Caption } from "../../components/Typography";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Footer from '../../components/Footer';

const profile = () => {
  const { colors, statusBarStyle } = useThemeStore();
  const router = useRouter();
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    updateVisibility,
    logout,
    onlineUsers,
  } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [visible, setVisible] = useState();

  useEffect(() => {
    if (!authUser) {
      router.replace("Login");
    }
  }, [authUser]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (result.canceled) return;

    const base64Img = "data:image/jpeg;base64," + result.assets[0].base64;

    setSelectedImg(base64Img);

    await updateProfile({ profilePic: base64Img });
  };

  const handleVisibility = () => {
    updateVisibility({ visible });
  };

  const exit = () => {
    logout();
    
  };

  return (
    <>
      {/* <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}> */}
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
        animated
      />
      <HomeHeader
        name={authUser?.name || "Profile"}
        icon="settings"
        fun={() => router.push("screens/settings")}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{ backgroundColor: colors.surface }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative justify-center items-center my-8">
          <Image
            source={
              authUser?.profilePic
                ? { uri: selectedImg || authUser?.profilePic }
                : require("../../assets/images/avtar.png")
            }
            style={{ width: 150, height: 150 }}
            resizeMode="cover"
            className="rounded-full mb-4"
          />
          <TouchableOpacity onPress={pickImage}>
            <Body style={{ color: colors.primary }}>Edit</Body>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="flex-row gap-6 px-8 py-4 items-center">
          <Ionicons color={colors.text} name="person-outline" size={24} />
          <View>
            <Mid className="mb-1">Name</Mid>
            <Caption style={{ fontWeight: "bold" }}>{authUser?.name}</Caption>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row gap-6 px-8 py-4 items-center">
          <Ionicons
            color={colors.text}
            name="information-circle-outline"
            size={24}
          />
          <View>
            <Mid className="mb-1">About</Mid>
            <Caption style={{ fontWeight: "bold" }}>
              {authUser?.about || "Hello Sakhi"}
            </Caption>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row gap-6 px-8 py-4 items-center">
          <Ionicons color={colors.text} name="mail-outline" size={24} />
          <View>
            <Mid className="mb-1">Email</Mid>
            <Caption style={{ fontWeight: "bold" }}>{authUser?.email}</Caption>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row gap-6 px-8 py-4 items-center">
          <Ionicons color={colors.text} name="call-outline" size={24} />
          <View>
            <Mid className="mb-1">Phone</Mid>
            <Caption style={{ fontWeight: "bold" }}>{authUser?.number}</Caption>
          </View>
        </TouchableOpacity>
        <View className=" px-8 py-4">
          <Heading className="mb-2">Visibility</Heading>
          <View className="flex-row">
            <View
              style={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: colors.border,
              }}
              className="w-40 h-fit"
            >
              <Picker
                selectedValue={visible}
                onValueChange={(val) => setVisible(val)}
                style={{ color: colors.text }}
                itemStyle={{ color: colors.text }}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Public" value={true} />
                <Picker.Item label="Private" value={false} />
              </Picker>
            </View>
            <TouchableOpacity
              className="py-4 px-8 rounded-3xl flex-row justify-center items-center mx-auto"
              style={{ backgroundColor: colors.primary }}
              onPress={handleVisibility}
            >
              <Mid style={{ color: "white" }}>Update</Mid>
            </TouchableOpacity>
          </View>
        </View>

        <View className="my-4 w-[90%] m-auto">
          <TouchableOpacity
            className="py-4 px-8 w-full rounded-2xl flex-row justify-center items-center mx-auto"
            style={{ backgroundColor: colors.danger }}
            onPress={exit}
          >
            <Mid style={{ color: "white" }}>Logout</Mid>
          </TouchableOpacity>
        </View>
        <Footer />
      </ScrollView>
      {/* </LinearGradient> */}
    </>
  );
};

export default profile;
