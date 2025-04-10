import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";

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
    const [quote, setQuote] = useState("");
    const { theme } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const router = useRouter();

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    const handleQuizzesPress = () => {
        router.push('/quizzes'); // Replace with actual route
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <Text style={[styles.header, themeStyles[theme].title]}>Daily Inspiration</Text>
            <Text style={[styles.quote, themeStyles[theme].text]}>{quote}</Text>

            <Text style={[styles.header, themeStyles[theme].title]}>Upcoming Events</Text>
            <Carousel
                loop
                width={screenWidth * 1.03}
                height={300}
                autoPlay={false}
                data={eventsData}
                scrollAnimationDuration={1000}
                mode="parallax"
                modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 30 }}
                style={{ marginBottom: 20 }}
                renderItem={({ item }) => <RenderItem item={item} />}
            />
            <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleQuizzesPress}>
                <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Go to Quizzes</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        width: '100%',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    quote: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 20,
        textAlign: 'center',
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
        marginTop: 10, // Adjust as needed
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
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
    },
};