import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

export default function verify_reset() {
    const router = useRouter();
    const { theme } = useTheme();
    const [mfaCode, setMfaCode] = useState('');

    const handleVerifyResetMFA = async () => {
        if (!mfaCode) {
            Alert.alert("Error", "Please enter the verification code!");
            return;
        }

        try {
            Alert.alert("Success", "MFA verified successfully!");
            router.push('/authentication/reset_password');
        } catch (error) {
            Alert.alert("Error", "Invalid MFA code. Try again.");
        }
    };

    const handleResendResetCode = async () => {
        try {
            Alert.alert("Success", "A new verification code has been sent.");
        } catch (error) {
            Alert.alert("Error", "Failed to resend the verification code.");
        }
    };

    return (
        <ThemeProvider>
            <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
                <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

                <Text style={[styles.title, themeStyles[theme].title]}>Enter MFA Code</Text>

                <TextInput
                    placeholder='Enter Verification Code'
                    placeholderTextColor={theme === "high-contrast" ? "#FFFF00" : theme === "dark" ? "#AAAAAA" : "#00000080"}
                    style={[styles.textInput, themeStyles[theme].textInput]}
                    value={mfaCode}
                    onChangeText={setMfaCode}
                    keyboardType="numeric"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleVerifyResetMFA}>
                    <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Verify Code</Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={themeStyles[theme].text}>Didn't receive a code?</Text>
                    <Pressable onPress={handleResendResetCode}>
                        <Text style={styles.resendText}> Resend Code</Text>
                    </Pressable>
                </View>

                <View style={styles.signInContainer}>
                    <Text style={themeStyles[theme].text}>Remembered your password?</Text>
                    <Pressable onPress={() => router.push('/authentication/login')}>
                        <Text style={styles.signInText}> Sign In Here</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
        backgroundColor: Colors.CREAM,
        width: '100%',
    },
    logo: {
        width: 180,
        height: 200,
        padding: 25,
        alignSelf: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    textInput: {
        borderWidth: 1,
        width: '100%',
        height: 60,
        padding: 10,
        fontSize: 18,
        marginTop: 20,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: Colors.WHITE,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        width: '100%',
        height: 60,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.WHITE,
        fontSize: 20,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    resendText: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    signInContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signInText: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        marginLeft: 5,
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