import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../../constant/Colors";
import { useTheme } from "../../context/ThemeContext";

export default function GAD7Instructions() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeContainer, themeStyles[theme].container]}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Title */}
          <Text style={[styles.title, themeStyles[theme].title]}>GAD - 7 Instructions</Text>

          {/* Instruction Box */}
          <View style={[styles.infoBox, themeStyles[theme].textInput]}>
            <Text style={[styles.infoText, themeStyles[theme].text]}>
              For the following 7 questions, please choose the option that best fits your current mindset.
            </Text>
          </View>

          <View style={[styles.infoBox, themeStyles[theme].textInput]}>
            <Text style={[styles.infoText, themeStyles[theme].text]}>
              After all questions have been answered, a final score will be provided. Please refer to provided tables and charts.
            </Text>
          </View>

          {/* Score Explanation Box */}
          <View style={[styles.infoBox, themeStyles[theme].textInput]}>
            <Text style={[styles.boldText, themeStyles[theme].text]}>Total Score Depression Severity</Text>
            <Text style={[styles.scoreText, themeStyles[theme].text]}>0-4 Minimal depression</Text>
            <Text style={[styles.scoreText, themeStyles[theme].text]}>5-9 Mild depression</Text>
            <Text style={[styles.scoreText, themeStyles[theme].text]}>10-14 Moderate anxiety</Text>
            <Text style={[styles.scoreText, themeStyles[theme].text]}>15-21 Severe anxiety</Text>
          </View>

          {/* Start Quiz Button */}
          <TouchableOpacity style={[styles.startButton, themeStyles[theme].button]} onPress={() => router.push("/quizzes/GAD7/QuizGAD7")}>
            <Text style={[styles.startButtonText, themeStyles[theme].buttonText]}>Take Health Check Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoBox: {
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginBottom: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 14,
    textAlign: "center",
  },
  startButton: {
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

const themeStyles = {
  light: {
    container: { backgroundColor: Colors.CREAM },
    title: { color: Colors.BLACK },
    textInput: { backgroundColor: Colors.WHITE },
    button: { backgroundColor: Colors.PRIMARY },
    buttonText: { color: Colors.WHITE },
    text: { color: Colors.BLACK },
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    title: { color: Colors.WHITE },
    textInput: { backgroundColor: Colors.GRAY },
    button: { backgroundColor: Colors.GRAY },
    buttonText: { color: Colors.WHITE },
    text: { color: Colors.WHITE },
  },
  "high-contrast": {
    container: { backgroundColor: "#000000" },
    title: { color: "#FFFF00" },
    textInput: { backgroundColor: "#000000", borderColor: "#FFFF00", borderWidth: 2 },
    button: { backgroundColor: "#FFFF00", borderColor: "#FFFFFF", borderWidth: 2 },
    buttonText: { color: "#000000" },
    text: { color: "#FFFF00" },
  },
};
