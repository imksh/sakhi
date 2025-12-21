import { View, ScrollView, StatusBar, Platform, Share } from "react-native";
import { useState } from "react";
import useThemeStore from "../../store/themeStore";
import { Heading } from "../../components/Typography";
import { LinearGradient } from "expo-linear-gradient";
import { save, clear } from "../../utils/storage.ts";
import SettingToggle from "../../components/SettingToggle";
import SettingsOptins from "../../components/SettingsOptions";
import ScreenHeader from "../../components/ScreenHeader";
import Footer from '../../components/Footer';

const settings = () => {
  const { colors, toggleTheme, statusBarStyle, theme, setDefault } =
    useThemeStore();
  const [isNotification, setIsNotification] = useState(true);
  const isDark = theme === "dark";
  const toggleDark = async () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    toggleTheme();
    await save("theme", nextTheme);
  };

  const toggleNotification = async () => {
    setIsNotification(!isNotification);
  };

  const clearStorage = async () => {
    await clear();
    setDefault();
  };

  const clearData = async () => {
    await clear();
    setDefault();
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Chat smarter with Sakhi — a friend in every chat 💬! Download it here: https://drive.google.com/drive/folders/1KQoY_6jAFDIEavD8glA9YlWS4b1tDGkS?usp=sharing",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("App shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.log("Error sharing app:", error.message);
    }
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === "android" ? colors.bg : undefined}
        animated
      />
      <ScreenHeader name="Settings" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 10,
          width: "92%",
          marginHorizontal: "auto",
        }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 py-8 "
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="px-4">
            <Heading>Preferences</Heading>
            <SettingToggle
              check={isDark}
              fun={toggleDark}
              name="Dark Mode"
              icon={"flash-outline"}
            />
            <SettingToggle
              check={isNotification}
              fun={toggleNotification}
              name="Notifications"
              icon={"notifications-outline"}
            />
          </View>
        </LinearGradient>
        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 py-8 "
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="px-4">
            <Heading>Actions</Heading>

            <SettingsOptins
              name="Share App"
              icon={"share-outline"}
              fun={shareApp}
              message={`Chat smarter with Sakhi💬 \n\nShare Sakhi with your loved ones.`}
            />

            <SettingsOptins
              name="Info"
              icon={"information-circle-outline"}
              message={`Sakhi is a modern real-time chat app for web and mobile that makes conversations feel natural and responsive.
Chat instantly, see who’s online or typing, get read receipts, and connect with SakhiAI — a friendly AI companion that’s always there to help..\n\n\n Developer: Karan Sharma \n\n ©️IdioticMinds`}
            />
          </View>
        </LinearGradient>

        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="my-4 py-8 "
          style={{
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="px-4">
            <Heading style={{ color: colors.danger }}>Danger Zone</Heading>

            <SettingsOptins
              fun={clearStorage}
              name="Reset App"
              icon={"refresh-circle-outline"}
              message="This wil reset the App permanently. This action cannot be undone."
            />
            <SettingsOptins
              fun={clearData}
              name="Clear App Data"
              icon={"trash-outline"}
              message="This wil clear the App Data permanently. This action cannot be undone."
            />
          </View>
        </LinearGradient>
      <Footer />
      </ScrollView>
    </LinearGradient>
  );
};

export default settings;
