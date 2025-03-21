import { useFocusEffect, useRouter } from "expo-router";
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function ResetSuccess() {

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
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../../assets/animations/Check.json')}
                        autoPlay
                        loop={false}
                        style={styles.animation}
                    />
                </View>

                <Text style={styles.title}>Password Reset Successful!</Text>
                <Text style={styles.subtitle}>Redirecting you to the home screen...</Text>
            </SafeAreaView>
        </GestureHandlerRootView>

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