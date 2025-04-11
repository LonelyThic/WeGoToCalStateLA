import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function PHQ9Instructions() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Title */}
          <Text style={styles.title}>GAD - 7 Instructions</Text>

          {/* Instruction Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              For the following 7 questions, please choose the option that best fits your current mindset.
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              After all questions have been answered, a final score will be provided. Please refer to provided tables and charts.
            </Text>
          </View>

          {/* Score Explanation Box */}
          <View style={styles.infoBox}>
            <Text style={styles.boldText}>Total Score Depression Severity</Text>
            <Text style={styles.scoreText}>0-4 Minimal depression</Text>
            <Text style={styles.scoreText}>5-9 Mild depression</Text>
            <Text style={styles.scoreText}>10-14 Moderate anxiety</Text>
            <Text style={styles.scoreText}>15-21 Severe anxiety</Text>
          </View>

          {/* Start Quiz Button */}
          <TouchableOpacity style={styles.startButton} onPress={() => router.push("/quizzes/GAD7/gad_7Q1")}>
            <Text style={styles.startButtonText}>Take Health Check Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F4F0EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F0EB",
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
    backgroundColor: "white",
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
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

