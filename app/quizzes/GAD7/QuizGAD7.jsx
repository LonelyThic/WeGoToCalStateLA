import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../../constant/Colors";
import { useTheme } from "../../context/ThemeContext";

const questions = [
    {
        id: 1,
        title: "GAD - 7 Question 1",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Feeling nervous, anxious, or on edge",
    },
    {
        id: 2,
        title: "GAD - 7 Question 2",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Not being able to stop or control worrying",
    },
    {
        id: 3,
        title: "GAD - 7 Question 3",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Worrying too much about diffrent things",
    },
    {
        id: 4,
        title: "GAD - 7 Question 4",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Trouble relaxing",
    },
    {
        id: 5,
        title: "GAD - 7 Question 5",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Being so restless that it is hard to sit still",
    },
    {
        id: 6,
        title: "GAD - 7 Question 6",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Becoming easily annoyed or irritable",
    },
    {
        id: 7,
        title: "GAD - 7 Question 7",
        question: "Over the last 2 weeks, how often have you been bothered by the following problem?",
        prompt: "Feeling afraid, as if something awful might happen",
    },
];

export default function QuizScreen() {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const router = useRouter();

    const currentQuestion = questions[currentIndex];
    const options = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

    const handleContinue = () => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = sliderValue;
        setAnswers(updatedAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSliderValue(updatedAnswers[currentIndex + 1] || 0);
        } else {
            // All questions done, navigate to results or summary
            const totalScore = updatedAnswers.reduce((acc, val) => acc + val, 0);
            router.push({ pathname: "/quizzes/GAD7/gad_7ResultsWG", params: { totalScoreGAD: totalScore.toString() } });
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <Text style={[styles.title, themeStyles[theme].title]}>{currentQuestion.title}</Text>

            <View style={[styles.questionBox, themeStyles[theme].questionBox]}>
                <Text style={[styles.questionText, themeStyles[theme].text]}>{currentQuestion.question}</Text>
            </View>

            <View style={styles.selectedOption}>
                <Text style={[styles.selectedOptionText, themeStyles[theme].text]}>{currentQuestion.prompt}</Text>
            </View>

            <View style={styles.sliderContainer}>
                <Text style={[styles.sliderLabel, themeStyles[theme].text]}>{options[sliderValue]}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={3}
                    step={1}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minimumTrackTintColor="#F4B400"
                    maximumTrackTintColor="grey"
                    thumbTintColor="#F4B400"
                />
                <Text style={[styles.sliderInstruction, themeStyles[theme].text]}>Slide to Choose Option</Text>
            </View>

            <TouchableOpacity style={[styles.continueButton, themeStyles[theme].button]} onPress={handleContinue}>
                <Text style={[styles.continueButtonText, themeStyles[theme].buttonText]}>Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
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

const themeStyles = {
    light: {
        container: { backgroundColor: Colors.CREAM },
        title: { color: Colors.BLACK },
        textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
        button: { backgroundColor: Colors.PRIMARY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        title: { color: Colors.WHITE },
        questionBox: { backgroundColor: "#333333" },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.WHITE },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        title: { color: "#FFFF00" },
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
        buttonText: { color: "#000000" },
        text: { color: "#FFFF00" },
        questionBox: { backgroundColor: "#333333" },
    },
};
