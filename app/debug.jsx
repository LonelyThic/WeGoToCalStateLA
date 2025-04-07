import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constant/Colors";

export default function Debugging() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Debugging Page</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/signup")}>
                    <Text style={styles.buttonText}>Go to Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/login")}>
                    <Text style={styles.buttonText}>Go to Login</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/account_setup")}>
                    <Text style={styles.buttonText}>Go to Account Setup</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/reset_password")}>
                    <Text style={styles.buttonText}>Go to Reset Password</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/mfa_verification")}>
                    <Text style={styles.buttonText}>Go to MFA Verification</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.button} onPress={() => router.push("/home_screen/home")}>
                    <Text style={styles.buttonText}>Go to Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/account_settings/setup")}>
                    <Text style={styles.buttonText}>Go to Setup</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/chat_bot/chat")}>
                    <Text style={styles.buttonText}>Go to Chat</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.CREAM,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        width: "80%",
        marginVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontWeight: "bold",
    },
});