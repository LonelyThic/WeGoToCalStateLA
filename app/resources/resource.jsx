import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
const TOP_BUFFER = Platform.OS === 'android' ? 70 : 10;
const BOTTOM_BUFFER = 120;
const TITLE_MARGIN_BOTTOM = 20;

export default function Resources() {
    const screenWidth = Dimensions.get('window').width;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [displayedTab, setDisplayedTab] = useState(null);
    const { t } = useTranslation();

    const data = [
        { id: 1, title: t("Mental Health"), description: t("Tips and resources for your mental well-being."), route: "mental_res", icon: "heart" },
        { id: 2, title: t("Financial Tips"), description: t("Advice for managing your money wisely."), route: "financial_res", icon: "cash" },
        { id: 3, title: t("Career Advice"), description: t("Insights to help you grow your career."), route: "career_res", icon: "briefcase" },
        { id: 4, title: t("Physical Well-Being"), description: t("Guidance on staying physically healthy."), route: "physical_res", icon: "fitness" },
    ];

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

    const BackHeader = () => (
        <View style={styles.backHeaderCentered}>
            <TouchableOpacity onPress={() => setDisplayedTab(null)} style={styles.backButtonCentered}>
                <Ionicons name="arrow-back" size={32} color={themeStyles[theme].backButtonIconColor} />
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => {
        switch (displayedTab) {
            case "mental_res": return (
                <>
                    <BackHeader />
                    <MentalRes />
                </>
            );
            case "financial_res": return (
                <>
                    <BackHeader />
                    <FinancialRes />
                </>
            );
            case "career_res": return (
                <>
                    <BackHeader />
                    <CareerRes />
                </>
            );
            case "physical_res": return (
                <>
                    <BackHeader />
                    <PhysicalRes />
                </>
            );
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
                        <Text style={[styles.header, themeStyles[theme].headerTitle]}>{t("Resources")}</Text>
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

const RenderItem = ({ item, onPress, themeStyles }) => (
    <TouchableOpacity onPress={() => onPress(item.route)}>
        <View style={[styles.item, { backgroundColor: Colors.SECONDARY }]}>
            <Ionicons name={item.icon} size={96} color={themeStyles.iconColor} style={{ marginBottom: 20 }} />
            <Text style={[styles.itemText, { color: themeStyles.sectionTitle.color }]}>{item.title}</Text>
            <Text style={[styles.cardDescription, { color: themeStyles.text.color }]}>{item.description}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.CREAM,
    },
    item: {
        width: Platform.OS === 'android' ? Dimensions.get('window').width * 1 : Dimensions.get('window').width * 0.99,
        alignSelf: 'center',
        height: Platform.OS === 'android' ? 540 : 650,
        borderRadius: 20,
        padding: 30,
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
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: TITLE_MARGIN_BOTTOM,
    },
    backHeaderCentered: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    backButtonCentered: {
        padding: 4,
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
        backButtonIconColor: Colors.BLACK,
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
        backButtonIconColor: Colors.WHITE,
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
        backButtonIconColor: "#FFFF00",
    },
    backHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    backTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
};