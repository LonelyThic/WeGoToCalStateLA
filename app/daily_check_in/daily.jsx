import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constant/Colors"; // Assuming you have a Colors.js file

export default function MoodCheckIn() {

  // Shared value for animated background color
  const backgroundColor = useSharedValue(0);

  // Mood options
  const moods = [
    { id: 1, label: "Sad", color: Colors.RED, emoji: "😢" },
    { id: 2, label: "Neutral", color: Colors.ORANGE, emoji: "😐" },
    { id: 3, label: "Happy", color: Colors.GREEN, emoji: "😊" },
  ];

  // Handles mood selection & triggers animation
  const handlePress = (index) => {
    backgroundColor.value = withTiming(index, { duration: 500 });
  };

  // Animated background color transition
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 1, 2],
        [Colors.RED, Colors.ORANGE, Colors.GREEN] // Using color constants
      ),
    };
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Animated.View style={[styles.animatedBackground, animatedBackgroundStyle]}>
        <Text style={styles.title}>How are you feeling?</Text>

        <View style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <Pressable
              key={mood.id}
              onPress={() => handlePress(index)}
              style={[styles.moodButton, { backgroundColor: mood.color }]}
            >
              <Text style={styles.moodText}>{mood.emoji}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Colors.SECONDARY, // Default color in case animation fails
  },
  animatedBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.WHITE,
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: "row",
    gap: 20,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  moodText: {
    fontSize: 40,
  },
});