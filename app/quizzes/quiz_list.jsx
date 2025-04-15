import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constant/Colors";
import { useTheme } from "../context/ThemeContext";

export default function QuizListScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <Text style={[styles.header, themeStyles[theme].title]}>Available Quizzes</Text>

            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={[styles.quizCard, themeStyles[theme].card]}
                    onPress={() => router.push("/quizzes/GAD7/gad_7Disclaimer")}
                >
                    <Text style={[styles.quizText, themeStyles[theme].text]}>GAD-7 Anxiety Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.quizCard, themeStyles[theme].card]}
                    onPress={() => router.push("/quizzes/PHQ9/phq_9Disclaimer")}
                >
                    <Text style={[styles.quizText, themeStyles[theme].text]}>PHQ-9 Depression Quiz</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    cardContainer: {
        flex: 1,
    },
    quizCard: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 10,
    },
    quizText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

const themeStyles = {
    light: {
        container: { backgroundColor: Colors.CREAM },
        title: { color: Colors.BLACK },
        text: { color: Colors.WHITE },
        card: { backgroundColor: Colors.PRIMARY },
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        title: { color: Colors.WHITE },
        text: { color: Colors.WHITE },
        card: { backgroundColor: Colors.GRAY },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        title: { color: "#FFFF00" },
        text: { color: "#FFFF00" },
        card: { backgroundColor: "#111111", borderColor: "#FFFF00", borderWidth: 2 },
    },
};
