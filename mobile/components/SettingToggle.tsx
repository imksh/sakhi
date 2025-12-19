import { View, Switch } from "react-native";
import { Mid } from "../components/Typography";
import { Ionicons } from "@expo/vector-icons";

export default function SettingToggle({ check, fun,icon,name }) {
  return (
    <View className="flex-row justify-between items-center my-4">
      <View className="flex-row justify-center items-center">
        <View className="p-4 bg-blue-600 rounded-2xl mr-5 justify-center items-center">
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <Mid>{name}</Mid>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={check ? "#2196F3" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={fun}
        value={check}
        style={{
          transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        }}
      />
    </View>
  );
}
