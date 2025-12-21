import { View } from "react-native";
import React from "react";
import { Body } from "./Typography";
import useThemeStore from "../store/themeStore";
import LottieView from "lottie-react-native";
import infinity from "../assets/animations/infinity.json";

const IdioticMinds = ({ message }) => {
  const { colors } = useThemeStore();
  return (
    <View style={{ alignItems: "center" }} className="gap-4 pb-8">
      <LottieView
        source={infinity}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
      {message && <Body style={{ fontSize: 14 }}>{message}</Body>}
    </View>
  );
};

export default IdioticMinds;
