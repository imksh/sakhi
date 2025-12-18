import { View, Image } from "react-native";
import React from "react";
import { Caption } from "./Typography";

export default function CustomImage({ source }) {
  return (
    <View className="justify-center items-center mt-20 mb-10">
      <Image
        source={source}
        style={{ width: 300, height: 300 }}
        resizeMode="contain"
      />
      <Caption className="mx-auto">Made with ❤️  ©️IdioticMinds</Caption>
      <Caption className="mx-auto"></Caption>
    </View>
  );
}
