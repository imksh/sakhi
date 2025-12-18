import { View } from "react-native";
import React from "react";
import { Heading } from "./Typography";
import useThemeStore from "../store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function HomeHeader({ name, icon, fun }) {
  const { colors } = useThemeStore();
  return (
    <View
      className="pt-16 pb-2 pl-4 flex-row items-center justify-between"
      style={{ backgroundColor: colors.bg, elevation: 2 }}
    >
      <Heading style={{ fontSize: 28, color: colors.primary }}>{name}</Heading>
      <TouchableOpacity onPress={fun} className="mr-8">
        <Ionicons name={icon} color={colors.text} size={28} />
      </TouchableOpacity>
    </View>
  );
}
