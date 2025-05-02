import { Ionicons } from '@expo/vector-icons';
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={themeStyles[theme].title.color} />
            </TouchableOpacity>
            <Text style={[styles.header, themeStyles[theme].title]}>Available Quizzes</Text>

            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={[styles.quizCard, themeStyles[theme].card]}
                    onPress={() => router.push("/quizzes/GAD7/gad_7Disclaimer")}
                >
                    <Text style={[styles.quizText, themeStyles[theme].text]}>GAD-7 Anxiety Quiz</Text>
                    <Text style={[styles.quizDescription, themeStyles[theme].description]}>
                        A brief 7-question tool to screen for generalized anxiety disorder.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.quizCard, themeStyles[theme].card]}
                    onPress={() => router.push("/quizzes/PHQ9/phq_9Disclaimer")}
                >
                    <Text style={[styles.quizText, themeStyles[theme].text]}>PHQ-9 Depression Quiz</Text>
                    <Text style={[styles.quizDescription, themeStyles[theme].description]}>
                        A 9-question assessment for measuring the severity of depression.
                    </Text>
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
    quizDescription: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 5,
        paddingHorizontal: 10,
    },
    backButton: {
        alignSelf: "flex-start",
        padding: 10,
    },
});

const themeStyles = {
    light: {
        container: { backgroundColor: Colors.CREAM },
        title: { color: Colors.BLACK },
        text: { color: Colors.WHITE },
        card: { backgroundColor: Colors.PRIMARY },
        description: { color: Colors.WHITE },
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        title: { color: Colors.WHITE },
        text: { color: Colors.WHITE },
        card: { backgroundColor: Colors.GRAY },
        description: { color: Colors.WHITE },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        title: { color: "#FFFF00" },
        text: { color: "#FFFF00" },
        card: { backgroundColor: "#111111", borderColor: "#FFFF00", borderWidth: 2 },
        description: { color: "#FFFF00" },
    },
};
