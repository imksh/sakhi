import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import EmojiKeyboard from "./EmojiKeyboard";
import { emojiCategories } from "../utils/emojis.ts";
import { Mid, Caption, Body } from "./Typography";
import useKeyboardVisible from "../hooks/useKeyboardVisible";
import useThemeStore from "../store/themeStore";
import { useChatStore } from "../store/useChatStore";
import * as ImagePicker from "expo-image-picker";
import { MotiView } from "moti";

const InputMessage = ({
  text,
  setText,
  imgPrev,
  send,
  setImgPrev,
  size,
  setSize,
}) => {
  const { colors } = useThemeStore();
  const [emoji, setEmoji] = useState(false);
  const keyboardVisible = useKeyboardVisible();
  const { isSendingMessage } = useChatStore();
  const inputRef = useRef(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (result.canceled) return;

    const base64Img = "data:image/jpeg;base64," + result.assets[0].base64;

    setImgPrev(base64Img);
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Camera permission is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (result.canceled) return;

    const img = "data:image/jpeg;base64," + result.assets[0].base64;

    setImgPrev(img);
  };

  useEffect(() => {
    if (keyboardVisible) {
      setEmoji(false);
    }
  }, [keyboardVisible]);
  useEffect(() => {
    if (emoji) {
      Keyboard.dismiss();
      return;
    }
  }, [emoji]);

  const { smileys, animals, food, symbols } = emojiCategories;
  return (
    <>
      <View className="flex-row items-end p-2">
        {imgPrev && (
          <View className="absolute bottom-1 p-2 pb-8 flex-row justify-between w-full">
            <View
              className="flex-row p-4  justify-between bg-gray-100 w-full"
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                width: size.width,
                paddingBottom: size.height - 20,
              }}
            >
              <View
                className="flex-row p-4 justify-between bg-blue-100 w-full"
                style={{
                  borderRadius: 20,
                }}
              >
                <Image
                  source={{ uri: imgPrev }}
                  style={{ width: 70, height: 70, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={() => setImgPrev(null)}>
                  <Ionicons
                    name="close-circle-outline"
                    color={colors.bg}
                    size={32}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View
          className="flex-1 flex-row items-end bg-gray-100 rounded-2xl px-3 py-2"
          ref={inputRef}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setSize({ width, height });
          }}
        >
          <TouchableOpacity onPress={() => setEmoji(!emoji)} className="mb-2">
            <Ionicons name="happy-outline" size={24} color="#555" />
          </TouchableOpacity>

          <TextInput
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Message"
            style={{ maxHeight: 150 }}
            className="flex-1 px-2 text-base"
          />

          {text.length === 0 && (
            <>
              <TouchableOpacity className="mx-1 mb-2" onPress={pickImage}>
                <Ionicons name="attach-outline" size={22} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity className="mx-1 mb-2" onPress={openCamera}>
                <Ionicons name="camera-outline" size={22} color="#555" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          className="ml-2 rounded-full p-3 mb-2 min-w-14 min-h-14 flex justify-center items-center overflow-hidden"
          style={{ backgroundColor: colors.primary }}
          onPress={send}
          disabled={isSendingMessage}
        >
          {text.length === 0 ? (
            
            <Ionicons name="heart-outline" size={24} color="#fff" />
          ) : (
            <MotiView
              from={{
                translateX: -15,
                translateY: 15,
                rotate: "50deg",
              }}
              animate={{
                translateX: 0,
                translateY: 0,
                rotate: "0deg",
              }}
              transition={{
                type: "timing",
                duration: 800, 
              }}
            >
              <FontAwesome5 name="telegram-plane" size={24} color="#fff" />
            </MotiView>
          )}
        </TouchableOpacity>
      </View>
      {emoji && (
        <ScrollView className="h-[280px] w-full p-2">
          <Caption>Smileys</Caption>
          <View className="flex-row gap-2 flex-wrap mt-2 mb-4">
            {smileys.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => setText(text + e)}>
                <Text style={{ fontSize: 28 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Caption>Symbols</Caption>
          <View className="flex-row gap-2 flex-wrap mt-2 mb-4">
            {symbols.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => setText(text + e)}>
                <Text style={{ fontSize: 28 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Caption>Animals</Caption>
          <View className="flex-row gap-2 flex-wrap mt-2 mb-4">
            {animals.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => setText(text + e)}>
                <Text style={{ fontSize: 28 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Caption>Food</Caption>
          <View className="flex-row gap-2 flex-wrap mt-2 mb-4">
            {food.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => setText(text + e)}>
                <Text style={{ fontSize: 28 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default InputMessage;
