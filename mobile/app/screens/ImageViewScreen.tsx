import { View, Image, TouchableOpacity,Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import useThemeStore from "../../store/themeStore";

export default function ImageViewScreen() {
  const { uri } = useLocalSearchParams();
  const { colors } = useThemeStore();
  const router = useRouter();

  const downloadImage = async (url) => {
    try {
      // 1️⃣ Request permission ONCE
      const permission = await MediaLibrary.getPermissionsAsync();

      if (!permission.granted) {
        const req = await MediaLibrary.requestPermissionsAsync();
        if (!req.granted) {
          Alert.alert("Permission denied", "Storage permission is required");
          return;
        }
      }

      // 2️⃣ Download to cache (safer)
      const fileUri = FileSystem.cacheDirectory + `image-${Date.now()}.jpg`;

      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      // 3️⃣ Save to gallery
      await MediaLibrary.saveToLibraryAsync(uri);

      Alert.alert("Downloaded", "Image saved to gallery");
    } catch (err) {
      console.log("Download error:", err);
      Alert.alert("Error", "Failed to save image");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View
        className="relative flex-row justify-between p-5"
        style={{ backgroundColor: colors.primary, paddingTop: 40 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 8,
            borderRadius: 50,
          }}
        >
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => downloadImage(uri)}
          style={{
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 8,
            borderRadius: 50,
          }}
        >
          <Ionicons name="download" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "contain",
        }}
        className="m-auto"
      />
    </View>
  );
}
