import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constant/Colors';
import { useTheme } from "../context/ThemeContext";
import CareerRes from "./career_res";
import FinancialRes from "./financial_res";
import MentalRes from "./mental_res";
import PhysicalRes from "./physical_res";
const TOP_BUFFER = Platform.OS === 'android' ? 100 : 10;
const BOTTOM_BUFFER = 120;
const TITLE_MARGIN_BOTTOM = 20;

const data = [
    { id: 1, title: "Mental Health", description: "Tips and resources for your mental well-being.", route: "mental_res", icon: "heart" },
    { id: 2, title: "Financial Tips", description: "Advice for managing your money wisely.", route: "financial_res", icon: "cash" },
    { id: 3, title: "Career Advice", description: "Insights to help you grow your career.", route: "career_res", icon: "briefcase" },
    { id: 4, title: "Physical Well-Being", description: "Guidance on staying physically healthy.", route: "physical_res", icon: "fitness" },
];

const RenderItem = ({ item, onPress, themeStyles }) => (
    <TouchableOpacity onPress={() => onPress(item.route)}>
        <View style={[styles.item, { backgroundColor: Colors.SECONDARY }]}>
            <Ionicons name={item.icon} size={96} color={themeStyles.iconColor} style={{ marginBottom: 20 }} />
            <Text style={[styles.itemText, { color: themeStyles.sectionTitle.color }]}>{item.title}</Text>
            <Text style={[styles.cardDescription, { color: themeStyles.text.color }]}>{item.description}</Text>
        </View>
    </TouchableOpacity>
);

export default function Resources() {
    const screenWidth = Dimensions.get('window').width;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [displayedTab, setDisplayedTab] = useState(null);

    const fadeAnim = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: fadeAnim.value }));

    // Animate background color on theme change
    const bgColor = useSharedValue(themeStyles[theme].container.backgroundColor);

    useEffect(() => {
        bgColor.value = withTiming(themeStyles[theme].container.backgroundColor, { duration: 300 });
    }, [theme]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: bgColor.value
    }));

    const handleTabChange = (tab) => {
        fadeAnim.value = withTiming(0, { duration: 90 }, () => {
            runOnJS(setDisplayedTab)(tab);
            fadeAnim.value = withTiming(1, { duration: 90 });
        });
    };

    const renderContent = () => {
        switch (displayedTab) {
            case "mental_res": return <MentalRes />;
            case "financial_res": return <FinancialRes />;
            case "career_res": return <CareerRes />;
            case "physical_res": return <PhysicalRes />;
            default: return null;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                animatedContainerStyle,
                {
                    paddingTop: insets.top + TOP_BUFFER,
                    paddingBottom: insets.bottom + BOTTOM_BUFFER,
                }
            ]}
        >
            <SafeAreaView style={{ flex: 1 }}>
                {!displayedTab ? (
                    <>
                        <Text style={[styles.header, themeStyles[theme].headerTitle]}>Resources</Text>
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
                            renderItem={({ item }) => (
                                <RenderItem item={item} onPress={handleTabChange} theme={theme} themeStyles={themeStyles[theme]} />
                            )}
                        />
                    </>
                ) : (
                    renderContent()
                )}
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
    item: {
        width: Dimensions.get('window').width * 0.9,
        alignSelf: 'center',
        height: 650,
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    itemText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: TITLE_MARGIN_BOTTOM,
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