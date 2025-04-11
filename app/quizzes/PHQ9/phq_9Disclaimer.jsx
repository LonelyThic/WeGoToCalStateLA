import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function PHQ9Disclaimer({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title */}
        <Text style={styles.title}>PHQ - 9 Test Disclaimer</Text>

        {/* Disclaimer Sections */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Informational Purpose Only: </Text>
            This test is designed for informational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Consult a Healthcare Professional: </Text>
            If you have concerns about your mental health or your test results, please consult a licensed healthcare provider.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Not a Crisis Resource: </Text>
            If you are experiencing a crisis or having thoughts of self-harm, contact a crisis hotline or local emergency services immediately.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Confidentiality: </Text>
            Your responses are confidential. Please ensure you are using the app in a secure environment to protect your privacy.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>User Responsibility: </Text>
            By continuing, you acknowledge that this is a self-assessment tool and accept the responsibility of seeking professional care.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Data Disclaimer: </Text>
            Your responses may be stored securely for app functionality purposes. Please review our privacy policy for more information.
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.boldText}>Age Restriction: </Text>
            This test is recommended for individuals aged 12 or older. If you are under 12, please seek guidance from a guardian or healthcare professional.
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.continueButton} onPress={() => router.push("/quizzes/PHQ9/phq_9Instructions")}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.previousResultsButton} onPress={() => navigation.navigate("PreviousResults")}>
          <Text style={styles.previousResultsText}>Previous Results</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F0EB",
    paddingTop: 40,
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
  disclaimerBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 14,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  previousResultsButton: {
    marginTop: 10,
  },
  previousResultsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
