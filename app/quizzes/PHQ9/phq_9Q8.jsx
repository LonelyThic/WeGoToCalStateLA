import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation
import Slider from "@react-native-community/slider"; 
import { useLocalSearchParams } from "expo-router";


export default function PHQ9Question() {
  const [sliderValue, setSliderValue] = useState(0);
  const router = useRouter(); // Initialize router for navigation
    const { totalScore } = useLocalSearchParams(); // 🟢 <-- this is what's missing!
  

  const options = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>PHQ - 9 Question 8</Text>

      {/* Question Box */}
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>
          Over the last 2 weeks, how often have you been bothered by the following problem?
        </Text>
      </View>

      {/* Selected Option */}
      <View style={styles.selectedOption}>
        <Text style={styles.selectedOptionText}>Moving or speaking so slowly that other people could have noticed? or the opposite -
            being so fidgety or restless that you have been moving around a lot more than usual? </Text>
      </View>

      {/* Slider Control */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>{options[sliderValue]}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={3}
          step={1}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
          minimumTrackTintColor="#F4B400"
          maximumTrackTintColor="grey"
          thumbTintColor="#F4B400"
        />
        <Text style={styles.sliderInstruction}>Slide to Choose Option</Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={() =>
             router.push({ pathname: "/quizzes/PHQ9/phq_9Q9",
             params: { totalScore: parseInt(totalScore) + sliderValue } })}>
               <Text style={styles.continueButtonText}>Continue</Text>
           </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedOption: {
    backgroundColor: "#FDD835",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 15,
  },
  selectedOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sliderContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  sliderLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
    height: 60,
    marginTop: 10,
  },
  sliderInstruction: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  continueButton: {
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 
