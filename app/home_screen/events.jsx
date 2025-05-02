import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";
import { getFinalScore } from "../quizzes/final_scores";
import PrevScore from '../quizzes/prev_score';
const TOP_BUFFER = Platform.OS === 'android' ? 70 : 70;
const BOTTOM_BUFFER = 120;
const TITLE_MARGIN_BOTTOM = 20;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(View);

const quotes = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Success is not final, failure is not fatal: It Is the courage to continue that counts. – Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
    "Your time is limited, so don’t waste it living someone else’s life. – Steve Jobs",
];

const eventsData = [
    { id: '1', title: "Morning Meditation", date: "Mar 30", time: "8:00 AM", description: "Join our daily meditation session to start your day with calm and focus." },
    { id: '2', title: "Wellness Webinar", date: "Apr 2", time: "12:00 PM", description: "A live webinar on mental health and self-care practices." },
    { id: '3', title: "Financial Fitness", date: "Apr 5", time: "6:00 PM", description: "Tips and advice to improve your financial well-being." },
    { id: '4', title: "Career Insights", date: "Apr 8", time: "10:00 AM", description: "A discussion on career growth and professional development." },
];

const RenderItem = ({ item }) => (
    <TouchableOpacity
        style={styles.eventCard}
        onPress={() => console.log("Card pressed")}
        pointerEvents="box-only"
    >
        <View style={styles.cardHeader}>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
        </View>
    </TouchableOpacity>
);

export default function Events() {
    const { t } = useTranslation();
    const [quote, setQuote] = useState("");
    const [gad7Score, setGad7Score] = useState(null);
    const [phq9Score, setPhq9Score] = useState(null);
    const [displayedTab, setDisplayedTab] = useState(null);
    const { theme } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Animation for tab transitions
    const fadeAnim = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);

        const fetchScores = async () => {
            const gad = await getFinalScore("GAD7");
            const phq = await getFinalScore("PHQ9");
            setGad7Score(gad);
            setPhq9Score(phq);
        };

        fetchScores();
    }, []);

    const handleQuizzesPress = () => {
        // router.push('../quizzes/GAD7/gad_7Disclaimer');
        router.push('../quizzes/quiz_list');
    };

    // Tab transition handler
    const handleTabChange = (tab) => {
        fadeAnim.value = withTiming(0, { duration: 200 }, (finished) => {
            if (finished) {
                runOnJS(setDisplayedTab)(tab);
                fadeAnim.value = withTiming(1, { duration: 200 });
            }
        });
    };

    // Content for each tab
    const renderContent = () => {
        if (displayedTab === "gad7") {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.header, themeStyles[theme].title]}>{t("GAD-7 Final Score")}</Text>
                    <Text style={[styles.scoreValue, themeStyles[theme].text]}>
                        {gad7Score !== null ? `${gad7Score} / 21` : t("Not available")}
                    </Text>
                    <TouchableOpacity style={[styles.button, themeStyles[theme].button, { marginTop: 30 }]} onPress={() => setDisplayedTab(null)}>
                        <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>{t("Back")}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (displayedTab === "phq9") {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={[styles.header, themeStyles[theme].title]}>{t("PHQ-9 Final Score")}</Text>
                    <Text style={[styles.scoreValue, themeStyles[theme].text]}>
                        {phq9Score !== null ? `${phq9Score} / 27` : t("Not available")}
                    </Text>
                    <TouchableOpacity style={[styles.button, themeStyles[theme].button, { marginTop: 30 }]} onPress={() => setDisplayedTab(null)}>
                        <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>{t("Back")}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (displayedTab === "prev_scores") {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => setDisplayedTab(null)}>
                            <Ionicons name="arrow-back" size={28} color={theme === "dark" ? "#FFF" : theme === "high-contrast" ? "#000" : "#000"} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginTop: 60, marginBottom: 20 }, themeStyles[theme].title]}>
                        {t("Previous Scores")}
                    </Text>
                    <PrevScore />
                </View>
            );
        }
        // fallback to main layout if needed
        return null;
    };

    return (
        <AnimatedSafeAreaView
            style={[
                styles.safeContainer,
                themeStyles[theme].container,
                {
                    paddingTop: insets.top + TOP_BUFFER,
                    paddingBottom: insets.bottom + BOTTOM_BUFFER,
                }
            ]}
            edges={["top", "left", "right"]}
        >
            {displayedTab === null ? (
                <>
                    <Text style={[styles.header, themeStyles[theme].title]}>{t("Daily Inspiration")}</Text>
                    <Text style={[styles.quote, themeStyles[theme].quote]}>{quote}</Text>

                    <Text style={[styles.header, themeStyles[theme].title]}>{t("Upcoming Events")}</Text>

                    <View style={{ alignItems: "center" }}>
                        <Carousel
                            loop
                            width={screenWidth * 0.9}
                            height={300}
                            autoPlay={false}
                            data={eventsData}
                            scrollAnimationDuration={1000}
                            mode="parallax"
                            modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 30 }}
                            style={{ marginBottom: 20 }}
                            renderItem={({ item }) => <RenderItem item={item} />}
                        />
                    </View>
                    <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleQuizzesPress}>
                        <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>{t("Go to Quizzes")}</Text>
                    </TouchableOpacity>

                    <Text style={[styles.header, themeStyles[theme].title]}>{t("Your Past Scores")}</Text>
                    <TouchableOpacity onPress={() => handleTabChange("prev_scores")}>
                        <View style={styles.scoreCard}>
                            <Text style={[styles.scoreLabel, themeStyles[theme].text]}>{t("GAD-7 Final Score:")}</Text>
                            <Text style={[styles.scoreValue, themeStyles[theme].text]}>
                                {gad7Score !== null ? `${gad7Score} / 21` : t("Not available")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabChange("prev_scores")}>
                        <View style={styles.scoreCard}>
                            <Text style={[styles.scoreLabel, themeStyles[theme].text]}>{t("PHQ-9 Final Score:")}</Text>
                            <Text style={[styles.scoreValue, themeStyles[theme].text]}>
                                {phq9Score !== null ? `${phq9Score} / 27` : t("Not available")}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleTabChange("prev_scores")}>
                        <View style={[styles.button, themeStyles[theme].button]}>
                            <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>{t("View All Previous Scores")}</Text>
                        </View>
                    </TouchableOpacity>
                </>
            ) : (
                <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                    {renderContent()}
                </Animated.View>
            )}
        </AnimatedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        width: '100%',
    },
    safeContainer: {
        flex: 1,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: TITLE_MARGIN_BOTTOM,
        textAlign: 'center',
    },
    quote: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 20,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    eventCard: {
        width: Dimensions.get('window').width * 0.9,
        height: 300,
        borderRadius: 10,
        backgroundColor: Colors.SECONDARY,
        padding: 15,
        marginRight: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    eventDate: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventTime: {
        fontSize: 16,
    },
    cardContent: {
        marginTop: 5,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        width: "90%",
        alignSelf: "center",
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    scoreCard: {
        backgroundColor: Colors.SECONDARY,
        padding: 15,
        borderRadius: 10,
        width: "90%",
        alignSelf: "center",
        marginBottom: 10,
    },
    scoreLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    scoreValue: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
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
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        title: { color: Colors.WHITE },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
        quote: { color: Colors.WHITE },
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        title: { color: "#FFFF00" },
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
        buttonText: { color: "#000000" },
        text: { color: Colors.BLACK },
        quote: { color: "#FFFF00" },
    },
};