import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Mid } from "../components/Typography";
import { Ionicons } from "@expo/vector-icons";
import ConfirmationToast from "./ConfirmationToast";
import { Portal } from "react-native-paper";
import useThemeStore from "../store/themeStore";

export default function SettingsOptins({ check, icon, fun, name, message }) {
  const [show, setShow] = useState(false);
  const { colors } = useThemeStore();
  return (
    <>
      <TouchableOpacity
        className="flex-row justify-between items-center my-4"
        onPress={() => setShow(!show)}
      >
        <View className="flex-row justify-center items-center">
          <View className="p-4 bg-blue-600 rounded-2xl mr-5 justify-center items-center">
            <Ionicons name={icon} size={18} color="#fff" />
          </View>
          <Mid>{name}</Mid>
        </View>
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Ionicons
            name="chevron-forward-outline"
            size={25}
            color={colors.text}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Portal>
        {show && (
          <ConfirmationToast
            name={name}
            icon={icon}
            fun={fun ?? (() => setShow(false))}
            message={message}
            setShow={setShow}
          />
        )}
      </Portal>
    </>
  );
}
