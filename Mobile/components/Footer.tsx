import { View } from "react-native";
import React from "react";
import { Caption } from "./Typography";
import useThemeStore from "../store/themeStore";
import LottieView from "lottie-react-native";
import infinity from "../assets/animations/infinity.json";

const Footer = () => {
  const { colors } = useThemeStore();
  return (
    <View style={{ alignItems: "center", marginTop: 20 }} className="gap-4 pb-8">
        <LottieView
          source={infinity}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      <Caption style={{ color: colors.textMuted, fontSize: 14 }}>
        © IdioticMinds | Crafted with ❤️
      </Caption>
    </View>
  );
};

export default Footer;
