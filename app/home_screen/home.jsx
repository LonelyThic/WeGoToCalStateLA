import { Ionicons } from "@expo/vector-icons"; // For chatbot icon
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constant/Colors";
import Setup from "../account_settings/setup";
import { useTheme } from "../context/ThemeContext";
import MoodCheckIn from "../daily_check_in/daily";
import Resources from "../resources/resource";
import Events from "./events";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(RNSafeAreaView);

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [displayedTab, setDisplayedTab] = useState("Home");
  const [activeTab, setActiveTab] = useState("Home");
  const { t } = useTranslation();

  const fadeAnim = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const handleTabChange = (tab) => {
    fadeAnim.value = withTiming(0, { duration: 90 }, () => {
      runOnJS(setDisplayedTab)(tab); // Delay switching content
      fadeAnim.value = withTiming(1, { duration: 90 });
    });
    setActiveTab(tab); // Update immediately for UI state (e.g., button highlighting)
  };

  // Function to render the content based on the active tab
  const renderContent = () => {
    switch (displayedTab) {
      case "Home":
        return <Events />;
      case "Resources":
        return <Resources />;
      case "Check-In":
        return <MoodCheckIn />;
      case "Profile":
        return <Setup />;
      default:
        return null;
    }
  };

  StatusBar.setBarStyle(theme === "high-contrast" ? "dark-content" : "light-content");
  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(themeStyles[theme].topBar.backgroundColor);
  }

  return (
    <>
      <View style={[styles.topBar, themeStyles[theme].topBar, { paddingTop: insets.top }]}>
        <Text style={[styles.username, { color: themeStyles[theme].usernameText }]}>{t("Welcome back, User")}</Text>
        <TouchableOpacity
          accessible
          accessibilityLabel={t("Go to Quizzes")}
          onPress={() => router.push("../quizzes/quiz_list")}
        >
          <Ionicons name="clipboard-outline" size={24} color={themeStyles[theme].iconColor} />
        </TouchableOpacity>
      </View>
      <AnimatedSafeAreaView
        style={[
          styles.container,
          themeStyles[theme].container,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      edges={["left", "right"]}
      >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <View style={{ flex: 1 }}>
          {["Home", "Profile"].includes(displayedTab) ? (
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 120,
              }}
            >
              {renderContent()}
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>
              {renderContent()}
            </View>
          )}
        </View>
      </Animated.View>

      {/* AI Chatbot Floating Button */}
      <TouchableOpacity style={styles.chatbotButton} onPress={() => router.push("../chat_bot/chatbotui")}>
        <Ionicons name="chatbubble-ellipses" size={28} color={Colors.WHITE} />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={[styles.navBar, themeStyles[theme].navBar]}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Home")}>
          <Ionicons name="home" size={24} color={themeStyles[theme].iconColor} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>{t("Home")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Resources")}>
          <Ionicons name="book" size={24} color={themeStyles[theme].iconColor} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>{t("Resources")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Check-In")}>
          <Ionicons name="checkmark-circle" size={24} color={themeStyles[theme].iconColor} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>{t("Daily Check In")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Profile")}>
          <Ionicons name="person" size={24} color={themeStyles[theme].iconColor} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>{t("Profile")}</Text>
        </TouchableOpacity>
      </View>
    </AnimatedSafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    marginBottom: 100,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  contentText: {
    fontSize: 22,
    textAlign: "center",
    color: Colors.BLACK,
  },
  chatbotButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.BLACK, // You can replace this with a dynamic color later
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors.BLACK, // You can replace this with a dynamic color later
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

const themeStyles = {
  light: {
    container: { backgroundColor: Colors.CREAM },
    title: { color: Colors.BLACK },
    subtitle: { color: Colors.DARK_GRAY },
    textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
    button: { backgroundColor: Colors.PRIMARY },
    buttonText: { color: Colors.WHITE },
    progressText: { color: Colors.DARK_GRAY },
    navBar: { backgroundColor: Platform.OS === 'android' ? Colors.PRIMARY : Colors.PRIMARY },
    navLabel: { color: Platform.OS === 'android' ? Colors.WHITE : Colors.WHITE },
    topBar: { backgroundColor: Platform.OS === 'android' ? Colors.PRIMARY : Colors.PRIMARY },
    iconColor: Platform.OS === 'android' ? Colors.WHITE : Colors.WHITE,
    usernameText: Platform.OS === 'android' ? Colors.WHITE : Colors.WHITE,
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    title: { color: Colors.WHITE },
    subtitle: { color: Colors.LIGHT_GRAY },
    textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
    button: { backgroundColor: Colors.GRAY },
    buttonText: { color: Colors.WHITE },
    progressText: { color: Colors.LIGHT_GRAY },
    navBar: { backgroundColor: Platform.OS === 'android' ? Colors.GRAY : Colors.GRAY },
    navLabel: { color: Colors.WHITE },
    topBar: { backgroundColor: Platform.OS === 'android' ? Colors.GRAY : Colors.GRAY },
    iconColor: Colors.WHITE,
    usernameText: Colors.WHITE,
  },
  "high-contrast": {
    container: { backgroundColor: "#000000" },
    title: { color: "#FFFF00" },
    subtitle: { color: "#FFFFFF" },
    textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
    button: {
      backgroundColor: "#FFFF00",
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    buttonText: { color: "#FFFF00" },
    progressText: { color: "#FFFF00" },
    navBar: { backgroundColor: Platform.OS === 'android' ? "#000000" : "#FFFF00" },
    navLabel: { color: Platform.OS === 'android' ? "#FFFF00" : Colors.BLACK },
    topBar: { backgroundColor: Platform.OS === 'android' ? "#000000" : "#FFFF00" },
    iconColor: Platform.OS === 'android' ? "#FFFF00" : Colors.BLACK,
    usernameText: Platform.OS === 'android' ? "#FFFF00" : Colors.BLACK,
  },
};