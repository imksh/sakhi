import { View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Heading } from "../components/Typography";

export default function SettingsHeader() {
  return (
    <View className="w-[90%] mx-auto flex-row mt-20 items-center  mb-2">
      <View className="p-5 bg-blue-600 rounded-2xl mr-5">
        <Ionicons name="settings-outline" size={30} color="#fff" />
      </View>
      <View>
        <Heading style={{ fontSize: 30, marginBottom: 0 }}>Settings</Heading>
      </View>
    </View>
  );
}
