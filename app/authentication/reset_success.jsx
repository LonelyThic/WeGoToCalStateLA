import { useFocusEffect, useRouter } from "expo-router";
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

export default function ResetSuccess() {
    const { theme } = useTheme();
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            router.setParams({ gestureEnabled: false });
            return () => router.setParams({ gestureEnabled: true });
        }, [])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/"); // Redirect to index.jsx after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup if component unmounts
    }, []);

    return (
        <ThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            source={require('../../assets/animations/Check.json')}
                            autoPlay
                            loop={false}
                            style={styles.animation}
                        />
                    </View>

                    <Text style={[styles.title, themeStyles[theme].title]}>Password Reset Successful!</Text>
                    <Text style={[styles.subtitle, themeStyles[theme].text]}>Redirecting you to the home screen...</Text>
                </SafeAreaView>
            </GestureHandlerRootView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.CREAM,
    },
    animationContainer: {
        width: 200,  // Explicit width
        height: 200, // Explicit height
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.PRIMARY,
        textAlign: "center",
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.BLACK,
        textAlign: "center",
        marginTop: 10,
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
        container: { backgroundColor: "#000000" }, // Black Background
        title: { color: "#FFFF00" }, // Yellow Title
        textInput: { backgroundColor: "#000000", color: "#FFFF00", borderColor: "#FFFF00", borderWidth: 2 }, // Yellow Text, Black Background
        button: { backgroundColor: "#FFFF00", borderWidth: 2, borderColor: "#FFFFFF" }, // Yellow Button with White Border
        buttonText: { color: "#000000" }, // Black Text for Contrast
        text: { color: "#FFFF00" }, // Yellow Text
    },
};