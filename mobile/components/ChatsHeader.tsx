import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Heading, Mid, Body, Regular } from "./Typography";
import useThemeStore from "../store/themeStore";
import { useRouter } from "expo-router";
import { useChatStore } from "../store/useChatStore";

export default function ChatsHeader({ user }) {
  const { colors } = useThemeStore();
  const router = useRouter();
  return (
    <View
      className="pt-16 pl-2 pb-4"
      style={{ backgroundColor: colors.bg, elevation: 2 }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity
          className="ml-2"
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back-outline" color={colors.text} size={24} />
        </TouchableOpacity>
        <View className="rounded-full ml-5 mr-3">
          <Image
            source={
              user?.profilePic
                ? { uri: user?.profilePic }
                : require("../assets/images/avtar.png")
            }
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
            className="rounded-full object-cover"
          />
        </View>
        <Body style={{ fontSize: 18 }} className="">
          {user?.name}
        </Body>
        <View className="flex-row absolute right-5 gap-7">
          <Ionicons name="call-outline" color={colors.text} size={24} />
          <Ionicons
            name="ellipsis-vertical-outline"
            color={colors.text}
            size={24}
          />
        </View>
      </View>
    </View>
  );
}
