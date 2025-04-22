import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";
import CareerRes from "./career_res";
import FinancialRes from "./financial_res";
import MentalRes from "./mental_res";
import PhysicalRes from "./physical_res";

const data = [
    { id: 1, title: "Mental Health", description: "Tips and resources for your mental well-being.", route: "mental_res", icon: "heart" },
    { id: 2, title: "Financial Tips", description: "Advice for managing your money wisely.", route: "financial_res", icon: "cash" },
    { id: 3, title: "Career Advice", description: "Insights to help you grow your career.", route: "career_res", icon: "briefcase" },
    { id: 4, title: "Physical Well-Being", description: "Guidance on staying physically healthy.", route: "physical_res", icon: "fitness" },
];

export default function Resources() {
    const { theme } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const [displayedTab, setDisplayedTab] = useState("main");
    const fadeAnim = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
        };
    });

    const handleTabChange = (tab) => {
        fadeAnim.value = withTiming(0, { duration: 90 }, () => {
            runOnJS(setDisplayedTab)(tab);
            fadeAnim.value = withTiming(1, { duration: 90 });
        });
    };

    const RenderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleTabChange(item.route)}>
                <View style={styles.item}>
                    <Ionicons name={item.icon} size={128} color={themeStyles[theme].iconColor} style={{ marginBottom: 10 }} />
                    <Text style={[styles.itemText, themeStyles[theme].sectionTitle]}>{item.title}</Text>
                    <Text style={[styles.cardDescription, themeStyles[theme].text]}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                {displayedTab === "main" ? (
                    <>
                        <View style={{ paddingHorizontal: 25 }}>
                            <Text style={[styles.header, themeStyles[theme].headerTitle]}>Resources</Text>
                        </View>
                        <View>
                            <Carousel
                                loop
                                width={screenWidth}
                                height={650}
                                autoPlay={false}
                                data={data}
                                scrollAnimationDuration={1000}
                                mode="parallax"
                                modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 30 }}
                                style={{ marginBottom: 20 }}
                                renderItem={({ item }) => <RenderItem item={item} />}
                            />
                        </View>
                    </>
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 10 }}>
                            <TouchableOpacity onPress={() => handleTabChange("main")} style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="arrow-back" size={24} color={themeStyles[theme].iconColor} />
                                <Text style={[{ marginLeft: 8, fontSize: 16 }, themeStyles[theme].text]}>Back</Text>
                            </TouchableOpacity>
                        </View>
                        {displayedTab === "mental_res" ? <MentalRes /> :
                            displayedTab === "financial_res" ? <FinancialRes /> :
                                displayedTab === "career_res" ? <CareerRes /> :
                                    displayedTab === "physical_res" ? <PhysicalRes /> :
                                        null}
                    </View>
                )}
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.CREAM,
    },
    item: {
        width: Dimensions.get('window').width,
        height: 650,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 12,
        paddingTop: 20,
        paddingHorizontal: 25,
        justifyContent: 'center',
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
        iconColor: Colors.BLACK,
    },
    "high-contrast": {
        container: { backgroundColor: "#000000" },
        headerTitle: { color: "#FFFF00" },
        sectionTitle: { color: Colors.BLACK },
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 },
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" },
        buttonText: { color: "#000000" },
        text: { color: Colors.BLACK },
        iconColor: Colors.BLACK,
    },
};