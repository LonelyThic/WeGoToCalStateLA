import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop, Polygon } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";



export default function PHQ9Results() {
  const insets = useSafeAreaInsets();

  // Mock Data
  //const score = 5;
  //const maxScore = 27;
  //const percentage = (score / maxScore) * 100;
  //const weeklyScores = [1, 1, 1, 1]; // Mock weekly data

  const { totalScore } = useLocalSearchParams();
  const score = parseInt(totalScore); // convert string to number if needed
  const maxScore = 27;
  const percentage = (score / maxScore) * 100;
  
  const weeklyScores = [1, 1, 1, 1];

  // Determine Depression Category
  const getCategory = (score) => {
    if (score <= 4) return "1-4 Minimal depression";
    if (score <= 9) return "5-9 Mild depression";
    if (score <= 14) return "10-14 Moderate depression";
    if (score <= 19) return "15-19 Moderately severe depression";
    return "20-27 Severe depression";
  };

  const getLabelColor = (score) => {
    if (score <= 4) return "#00C853";  // Green
    if (score <= 5) return "#83f28f";  // Light Green
    if (score <= 9) return "#FFEB3B";  // Yellow
    if (score <= 14) return "#FFC107"; // Amber
    if (score <= 19) return "#FF9800"; // Orange
    return "#D32F2F";                 // Red
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Title */}
          <Text style={styles.title}>PHQ - 9 Results</Text>

          {/* Gradient Bar Chart */}
          <View style={styles.chartBox}>
            <Svg height="100" width="100%">
              <Defs>
                <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#00C853" />
                  <Stop offset="0.50" stopColor="#FFEB3B" />
                  <Stop offset="0.60" stopColor="#FF9800" />
                  <Stop offset="1" stopColor="#D32F2F" />
                </LinearGradient>
              </Defs>

              {/* Gradient Bar with Border */}
              <Rect x="0" y="35" width="100%" height="15" fill="url(#gradient)" rx="5" stroke="black" strokeWidth="1" />

              {/* Score Marker Box */}
              <Rect
                x={`${percentage}%`}
                y="10"
                width="30"
                height="30"
                rx="5"
                fill={getLabelColor(score)}
                stroke="black"
                strokeWidth="1"
                transform="translate(-15, 0)"
              />
              <SvgText
                x={`${percentage}%`}
                y="30"
                fontSize="20"
                fontWeight="bold"
                fill="black"
                textAnchor="middle"
              >
                {score}
              </SvgText>
  
              {/* Start and End Numbers */}
              <SvgText x="0" y="80" fontSize="22" fontWeight="bold" fill="black" textAnchor="start">0</SvgText>
              <SvgText x="295" y="80" fontSize="22" fontWeight="bold" fill="black" textAnchor="end">27</SvgText>
            </Svg>

            {/* Score Meaning Box */}
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{score}/27</Text>
              <Text style={styles.categoryText}>{getCategory(score)}</Text>
            </View>
          </View>

          {/* Weekly Score Chart */}
          <View style={styles.weeklyChartBox}>
            <View style={styles.weeklyBarContainer}>
              {weeklyScores.map((val, index) => (
                <View key={index} style={styles.weeklyBar}>
                  <Text style={styles.weeklyScore}>{val}</Text>
                </View>
              ))}
            </View>
            <View style={styles.weeklyLabels}>
              {["Week 1", "Week 3", "Week 5", "Week 7"].map((label, index) => (
                <Text key={index} style={styles.weeklyLabel}>
                  {label}
                </Text>
              ))}
            </View>
            </View>
         {/* Continue Button */}
                   <TouchableOpacity style={styles.continueButton} onPress={() => router.push("/nextScreen")}>
                     <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: "#F8E980",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    marginTop: 30,
  },
  chartBox: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  }, 
  scoreBox: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  weeklyChartBox: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 80,
  }, 
  weeklyBarContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
  },
  weeklyBar: {
    backgroundColor: "#F4B400",
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  weeklyScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  weeklyLabels: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: 5,
  },
  weeklyLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 25,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
 
});
