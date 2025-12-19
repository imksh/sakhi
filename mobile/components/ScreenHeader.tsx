import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Heading } from "./Typography";
import useThemeStore from '../store/themeStore';
import { useRouter } from 'expo-router';

export default function ScreenHeader({name}) {

  const { colors } = useThemeStore();
  const router = useRouter();
  return (
    <View
      className="pt-16 pl-4 pb-4"
      style={{ backgroundColor: colors.bg, elevation: 2 }}
    >
      <View className="flex-row">
        <TouchableOpacity className="" onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" color={colors.text} size={30} />
        </TouchableOpacity>
        <Heading className="ml-4">{name}</Heading>
      </View>
    </View>
  );
}
