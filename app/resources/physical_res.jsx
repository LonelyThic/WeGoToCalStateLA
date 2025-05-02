import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";

const data = [
    {
        id: 1,
        title: "MyHealth LA",
        description: "Free healthcare for low-income residents.",
        route: "physical_res",
        icon: "heart",
        resources: [{ label: "dhs.lacounty.gov", url: "https://dhs.lacounty.gov" }]
    },
    {
        id: 2,
        title: "LA Parks & Rec",
        description: "County fitness and recreation centers.",
        route: "physical_res",
        icon: "leaf",
        resources: [{ label: "parks.lacounty.gov", url: "https://parks.lacounty.gov" }]
    },
    {
        id: 3,
        title: "CSULA Health Services",
        description: "Campus wellness and medical services.",
        route: "physical_res",
        icon: "medkit",
        resources: [{ label: "csula.edu", url: "https://www.calstatela.edu" }]
    },
    {
        id: 4,
        title: "Metro Bike Program",
        description: "Transit-integrated cycling and bike share.",
        route: "physical_res",
        icon: "bicycle",
        resources: [{ label: "bike.metro.net", url: "https://bike.metro.net" }]
    }
];

export default function Resources({ setDisplayedTab }) {
    const { theme } = useTheme();

    const fadeAnim = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: fadeAnim.value }));

    const openInApp = async (url) => {
        await WebBrowser.openBrowserAsync(url);
    };

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
                <View style={{ paddingHorizontal: 25 }}>
                    <Text style={[styles.header, themeStyles[theme].headerTitle]}>Physical Resources</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {data.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => item.resources?.[0]?.url && openInApp(item.resources[0].url)}>
                            <View style={styles.card}>
                                <Ionicons name={item.icon} size={48} color={themeStyles[theme].sectionTitle.color} style={{ marginBottom: 10 }} />
                                <Text style={[styles.itemText, themeStyles[theme].sectionTitle]}>{item.title}</Text>
                                <Text style={[styles.cardDescription, themeStyles[theme].text]}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.CREAM,
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingBottom: 100, // Added for smoother scroll ending
    },
    card: {
        backgroundColor: Colors.SECONDARY,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    itemText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 25,
    },
    backHeaderCentered: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    backButtonCentered: {
        padding: 10,
    },
});

const themeStyles = {
    light: {
        container: { backgroundColor: Colors.CREAM },
        headerTitle: { color: Colors.BLACK },
        sectionTitle: { color: Colors.BLACK },
        textInput: { backgroundColor: Colors.WHITE, color: Colors.BLACK },
        button: { backgroundColor: Colors.PRIMARY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
        iconColor: Colors.BLACK,
    },
    dark: {
        container: { backgroundColor: Colors.M_CHAR },
        headerTitle: { color: Colors.WHITE },
        sectionTitle: { color: Colors.BLACK },
        textInput: { backgroundColor: Colors.GRAY, color: Colors.WHITE },
        button: { backgroundColor: Colors.GRAY },
        buttonText: { color: Colors.WHITE },
        text: { color: Colors.BLACK },
        iconColor: Colors.WHITE,
        backIcon: Colors.WHITE,
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        headerTitle: { color: "#FFFF00" },
        sectionTitle: { color: Colors.BLACK },
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
        buttonText: { color: "#000000" },
        text: { color: Colors.BLACK },
        iconColor: "#FFFF00",
    },
};