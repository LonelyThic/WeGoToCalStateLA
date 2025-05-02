import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constant/Colors';
import { useTheme } from '../context/ThemeContext';

const TOP_BUFFER = Platform.OS === 'android' ? 70 : 10;
const BOTTOM_BUFFER = 120;

const getGAD7Color = (score) => {
    if (score <= 4) return '#00C853'; // Green
    if (score <= 9) return '#83f28f'; // Lime Green
    if (score <= 14) return '#FFC107'; // Yellow-Orange
    return '#D32F2F'; // Red
};

const getPHQ9Color = (score) => {
    if (score <= 4) return '#00C853'; // Green
    if (score <= 9) return '#83f28f'; // Lime Green
    if (score <= 14) return '#FFC107'; // Yellow-Orange
    if (score <= 19) return '#FF9800'; // Deeper Orange
    return '#D32F2F'; // Red
};

const ScoreCard = ({ label, score, type, theme }) => {
    const color = type === 'GAD7' ? getGAD7Color(score) : getPHQ9Color(score);
    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            <Text style={[styles.cardText, themeStyles[theme].text]}>{label}</Text>
            <Text style={[styles.cardScore, themeStyles[theme].text]}>{score}</Text>
        </View>
    );
};

export default function PrevScore() {
    const { theme } = useTheme();
    const [scores, setScores] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const gad = await AsyncStorage.getItem('weeklyScoresGAD7');
                const phq = await AsyncStorage.getItem('weeklyScoresPHQ9');
                const gadScores = gad ? JSON.parse(gad) : [];
                const phqScores = phq ? JSON.parse(phq) : [];

                const allScores = [
                    ...gadScores.map((s, i) => ({ type: 'GAD7', score: s, label: `GAD7 - Week ${i + 1}` })),
                    ...phqScores.map((s, i) => ({ type: 'PHQ9', score: s, label: `PHQ9 - Week ${i + 1}` })),
                ];
                setScores(allScores);
            } catch (err) {
                console.error('Failed to load scores', err);
            }
        };

        fetchScores();
    }, []);

    return (
        <View style={[{ flex: 1 }, themeStyles[theme].container]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {scores.map((entry, index) => (
                    <ScoreCard key={index} {...entry} theme={theme} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardScore: {    
        fontSize: 16,
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 20,
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
        quote: { color: Colors.DARK_GRAY },
        header: { color: Colors.BLACK },
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        title: { color: Colors.WHITE },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
        quote: { color: Colors.WHITE },
        header: { color: Colors.WHITE },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        title: { color: "#FFFF00" },
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
        buttonText: { color: "#000000" },
        text: { color: Colors.BLACK },
        quote: { color: "#FFFF00" },
        header: { color: "#FFFF00" },
    },
};