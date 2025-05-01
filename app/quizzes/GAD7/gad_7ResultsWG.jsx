import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from "react-native-svg";
import Colors from "../../../constant/Colors";
import { useTheme } from "../../context/ThemeContext";
import { saveFinalScore } from "../final_scores";

export default function GAD7Results() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { totalScoreGAD } = useLocalSearchParams();
  const score = parseInt(totalScoreGAD); // convert string to number if needed
  useEffect(() => {
    saveFinalScore("GAD7", score);
  }, []);
  const maxScore = 21;
  const percentage = (score / maxScore) * 100;

  const [weeklyScores, setWeeklyScores] = React.useState([]);

  useEffect(() => {
    const updateScores = async () => {
      try {
        const existing = await AsyncStorage.getItem("weeklyScoresGAD7");
        let parsed = existing ? JSON.parse(existing) : [];
        parsed.push(score);
        await AsyncStorage.setItem("weeklyScoresGAD7", JSON.stringify(parsed));
        setWeeklyScores(parsed);
      } catch (e) {
        console.error("Failed to load or update weekly scores", e);
      }
    };
    updateScores();
  }, []);

  const getCategory = (score) => {
    if (score <= 4) return "1-4 Minimal anxiety";
    if (score <= 9) return "5-9 Mild anxiety";
    if (score <= 14) return "10-14 Moderate anxiety";
    return "15-21 Severe anxiety";
  };

  const getLabelColor = (score) => {
    if (score <= 4) return "#00C853";  // Green
    if (score <= 7) return "#83f28f";  // Light Green
    if (score <= 9) return "#FFEB3B";  // Yellow
    if (score <= 12) return "#FFC107"; // Amber
    if (score <= 17) return "#FF9800"; // Orange
    return "#D32F2F";                 // Red
  };

  return (
    <SafeAreaView style={[styles.safeContainer, themeStyles[theme].container]}>
      <View style={[styles.container, themeStyles[theme].innerContainer, { paddingTop: insets.top + 20 }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Title */}
          <Text style={[styles.title, themeStyles[theme].headingText]}>GAD - 7 Results</Text>

          {/* Gradient Bar Chart */}
          <View style={[styles.chartBox, themeStyles[theme].card]}>
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
                x={`${Math.min(Math.max(percentage, 5), 95)}%`}
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
                x={`${Math.min(Math.max(percentage, 5), 95)}%`}
                y="30"
                fontSize="20"
                fontWeight="bold"
                fill="black"
                textAnchor="middle"
              >
                {score}
              </SvgText>

              {/* Start and End Numbers */}
              <SvgText x="0" y="80" textAnchor="start" style={[styles.svgText, themeStyles[theme].svgText]}>0</SvgText>
              <SvgText x="100%" y="80" textAnchor="end" style={[styles.svgText, themeStyles[theme].svgText]}>21</SvgText>
            </Svg>

            {/* Score Meaning Box */}
            <View style={[styles.scoreBox, themeStyles[theme].scoreBox]}>
              <Text style={[styles.scoreText, themeStyles[theme].scoreText]}>{score}/21</Text>
              <Text style={[styles.categoryText, themeStyles[theme].categoryText]}>{getCategory(score)}</Text>
            </View>
          </View>

          {/* Weekly Score Chart */}
          <View style={[styles.weeklyChartBox, themeStyles[theme].card]}>
            {Array.from({ length: Math.ceil(weeklyScores.length / 4) }, (_, rowIndex) => {
              const rowScores = weeklyScores.slice(rowIndex * 4, rowIndex * 4 + 4);
              return (
                <View key={`row-${rowIndex}`} style={{ marginBottom: 10 }}>
                  <View style={styles.weeklyBarContainer}>
                    {rowScores.map((val, index) => (
                      <View key={index} style={styles.weeklyBar}>
                        <Text style={[styles.weeklyScore, themeStyles[theme].text]}>{val}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.weeklyLabels}>
                    {rowScores.map((_, index) => {
                      const weekNumber = rowIndex * 4 + index + 1;
                      return (
                        <Text key={index} style={[styles.weeklyLabel, themeStyles[theme].weekLabelText]}>
                          Week {weekNumber}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
          {/* Continue Button */}
          <TouchableOpacity style={[styles.continueButton, themeStyles[theme].button]} onPress={() => router.push("/home_screen/home")}>
            <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Continue</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8E9B0',
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
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  scoreBox: {
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
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  svgText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

const themeStyles = {
  light: {
    container: { backgroundColor: Colors.CREAM },
    innerContainer: { backgroundColor: Colors.LIGHT_YELLOW },
    card: { backgroundColor: Colors.WHITE },
    scoreBox: { backgroundColor: Colors.PRIMARY },
    headingText: { color: Colors.BLACK },
    scoreText: { color: Colors.WHITE },
    categoryText: { color: Colors.WHITE },
    weekLabelText: { color: Colors.DARK_GRAY },
    text: { color: Colors.BLACK },
    button: { backgroundColor: Colors.PRIMARY },
    buttonText: { color: Colors.WHITE },
    svgText: { fill: Colors.BLACK },
  },
  dark: {
    container: { backgroundColor: Colors.M_CHAR },
    innerContainer: { backgroundColor: Colors.M_CHAR },
    card: { backgroundColor: "#2C2C2C" },
    scoreBox: { backgroundColor: "#3A3A3A" },
    headingText: { color: Colors.WHITE },
    scoreText: { color: Colors.WHITE },
    categoryText: { color: "#CCCCCC" },
    weekLabelText: { color: "#CCCCCC" },
    text: { color: Colors.WHITE },
    button: { backgroundColor: Colors.GRAY },
    buttonText: { color: Colors.WHITE },
    svgText: { fill: Colors.WHITE },
  },
  "high-contrast": {
    container: { backgroundColor: "#000000" },
    innerContainer: { backgroundColor: "#000000" },
    card: { backgroundColor: "#FFFF00" },
    scoreBox: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
    headingText: { color: "#000000" },
    scoreText: { color: "#000000" },
    categoryText: { color: "#000000" },
    weekLabelText: { color: "#000000" },
    text: { color: "#000000" },
    button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
    buttonText: { color: "#000000" },
    svgText: { fill: "#000000" },
  },
};
