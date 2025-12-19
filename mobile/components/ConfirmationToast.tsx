import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Heading, Body, Mid } from "../components/Typography";
import { LinearGradient } from "expo-linear-gradient";
import useThemeStore from "../store/themeStore";

export default function ConfirmationToast({
  name,
  message,
  fun,
  icon,
  setShow,
}) {
  const { colors } = useThemeStore();

  const ok = () => {
    fun();
    setShow(false);
  };

  return (
    <View className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%]">
      <LinearGradient
        colors={colors.gradients.surface}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="my-4 pt-8 "
        style={{
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="justify-center items-center px-8">
          <Heading>{name}</Heading>
          <Body className="mt-4" style={{ textAlign: "center" }}>
            {message}
          </Body>
        </View>
        <View
          className="flex-row mt-8"
          style={{ borderTopWidth: 1, borderTopColor: colors.border }}
        >
          <TouchableOpacity
            className="w-[50%] justify-center items-center h-20"
            style={{ borderRightWidth: 1, borderRightColor: colors.border }}
            onPress={() => setShow(false)}
          >
            <Mid>Cancle</Mid>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[50%] justify-center items-center"
            style={{ borderLeftWidth: 1, borderLeftColor: colors.border }}
            onPress={ok}
          >
            <Mid>Ok</Mid>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
