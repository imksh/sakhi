import { View, Text, Image } from "react-native";
import React from "react";
import { Heading,Mid } from './Typography';

const Loading = ({name}) => {
  return (
    <View className="justify-center items-center m-auto w-full min-h-full ">
      <Image
        source={require("../assets/images/logoBgRemoved.png")}
        style={{ width: 100, height: 100 }}
        resizeMode="contain"
        className="animate-bounce"
      />
      <Mid>{name}</Mid>
    </View>
  );
};

export default Loading;
