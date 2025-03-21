import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constant/Colors"; // Adjust import as needed

export default function MoodCheckIn() {
  const router = useRouter();
  const backgroundColor = useSharedValue(0);
  const selectedMood = useSharedValue(-1);

  // Local state for display and history
  const [selectedMoodLabel, setSelectedMoodLabel] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);

  // Mood options
  const moods = [
    { id: 1, label: "Sad", color: Colors.RED, emoji: "😢" },
    { id: 2, label: "Neutral", color: Colors.ORANGE, emoji: "😐" },
    { id: 3, label: "Happy", color: Colors.GREEN, emoji: "😊" },
  ];

  // Handle mood selection
  const handleMoodPress = (index) => {
    backgroundColor.value = withTiming(index, { duration: 500 });
    selectedMood.value = index;
    setSelectedMoodLabel(moods[index].label);
  };

  // Animated background color based on selected mood
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 1, 2],
        [Colors.RED, Colors.ORANGE, Colors.GREEN]
      ),
    };
  });

  // Check if submission is allowed today
  const canSubmitToday = () => {
    const today = new Date().toISOString().split("T")[0];
    const todaysSubmissions = moodHistory.filter(entry => entry.date.split("T")[0] === today);
    if (todaysSubmissions.length === 0) {
      return true; // New day: no submission yet
    } else {
      // If the latest submission for today isn't Sad or Neutral, disallow submission
      const lastSubmission = todaysSubmissions[todaysSubmissions.length - 1];
      if (lastSubmission.mood !== "Sad" && lastSubmission.mood !== "Neutral") {
        return false;
      }
      return true;
    }
  };

  // Submit mood with validation and optional reminder alert
  const handleSubmitMood = () => {
    if (!selectedMoodLabel) {
      Alert.alert("Please select a mood first.");
      return;
    }

    if (!canSubmitToday()) {
      Alert.alert("Already submitted", "You have already checked in today.");
      return;
    }

    // Create a new submission entry
    const newEntry = {
      date: new Date().toISOString(),
      mood: selectedMoodLabel,
    };

    setMoodHistory(prev => [...prev, newEntry]);
    Alert.alert("Mood submitted!", `You logged feeling ${selectedMoodLabel}.`);

    // If the mood is Sad or Neutral, ask if they want a reminder later
    if (selectedMoodLabel === "Sad" || selectedMoodLabel === "Neutral") {
      Alert.alert(
        "Reminder",
        "It seems you're not feeling your best. Would you like to be reminded later to check in again?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes", onPress: () => {
              // Placeholder: integrate a notification scheduler (e.g., using expo-notifications)
              Alert.alert("Notification scheduled", "We will remind you later.");
            }
          }
        ]
      );
    }

    // Reset selection and animated background
    setSelectedMoodLabel("");
    selectedMood.value = -1;
    backgroundColor.value = withTiming(0, { duration: 500 });
  };

  // Nested component for mood button with scaling animation
  const MoodButton = ({ mood, index }) => {
    const animatedScaleStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: selectedMood.value === index
              ? withTiming(1.2, { duration: 300 })
              : withTiming(1, { duration: 300 }),
          },
        ],
      };
    });

    return (
      <Pressable onPress={() => handleMoodPress(index)}>
        <Animated.View style={[styles.moodButton, { backgroundColor: mood.color }, animatedScaleStyle]}>
          <Text style={styles.moodText}>{mood.emoji}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  // Render a mood history item
  const renderMoodItem = ({ item }) => {
    const dateStr = item.date.split("T")[0];
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyText}>{dateStr}</Text>
        <Text style={styles.historyText}>{item.mood}</Text>
      </View>
    );
  };

  // Display last 7 submissions (most recent first)
  const lastSevenEntries = moodHistory.slice(-7).reverse();

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundStyle]} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>How are you feeling?</Text>
        <View style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <MoodButton key={mood.id} mood={mood} index={index} />
          ))}
        </View>
        {selectedMoodLabel ? (
          <Text style={styles.selectionText}>You selected {selectedMoodLabel}</Text>
        ) : null}
        <Pressable style={styles.submitButton} onPress={handleSubmitMood}>
          <Text style={styles.submitButtonText}>Submit Mood</Text>
        </Pressable>
        {moodHistory.length > 0 && (
          <>
            <Text style={styles.historyTitle}>Last 7 Moods:</Text>
            <FlatList
              data={lastSevenEntries}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={renderMoodItem}
              style={{ marginTop: 10, width: "80%" }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  moodContainer: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 20,
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
  selectionText: {
    fontSize: 20,
    color: Colors.WHITE,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Colors.BLACK,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
  },
  historyTitle: {
    marginTop: 20,
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  historyText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
});