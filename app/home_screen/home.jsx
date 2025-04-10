import { Ionicons } from "@expo/vector-icons"; // For chatbot icon
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  return (
    <AnimatedSafeAreaView
      style={[
        styles.container,
        themeStyles[theme].container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      edges={["left", "right"]}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {renderContent()}
      </Animated.View>

      {/* AI Chatbot Floating Button */}
      <TouchableOpacity style={styles.chatbotButton} onPress={() => router.push("../chat_bot/chatbotui")}>
        <Ionicons name="chatbubble-ellipses" size={28} color={Colors.WHITE} />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={[styles.navBar, themeStyles[theme].navBar]}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Home")}>
          <Ionicons name="home" size={24} color={Colors.WHITE} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Resources")}>
          <Ionicons name="book" size={24} color={Colors.WHITE} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>Resources</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Check-In")}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.WHITE} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabChange("Profile")}>
          <Ionicons name="person" size={24} color={Colors.WHITE} />
          <Text style={[styles.navLabel, themeStyles[theme].navLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </AnimatedSafeAreaView>
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
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
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
    navBar: { backgroundColor: Colors.PRIMARY },
    navLabel: { color: Colors.WHITE },
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    title: { color: Colors.WHITE },
    subtitle: { color: Colors.LIGHT_GRAY },
    textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
    button: { backgroundColor: Colors.GRAY },
    buttonText: { color: Colors.WHITE },
    progressText: { color: Colors.LIGHT_GRAY },
    navBar: { backgroundColor: Colors.GRAY },
    navLabel: { color: Colors.WHITE },
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
    buttonText: { color: "#000000" },
    progressText: { color: "#FFFFFF" },
    navBar: { backgroundColor: "#FFFF00" },
    navLabel: { color: "#000000" },
  },
};