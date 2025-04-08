import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";
import { useTheme } from "../context/ThemeContext";

export default function verify_email() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const { theme } = useTheme();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email!");
            return;
        }

        try {
            /*
            
              Cognito Forgot Password Code Here
            
            */
            Alert.alert("Success", "A password reset code has been sent to your email.");
            router.push('/authentication/verify_reset'); // Redirect to the verification page

        } catch (error) {
            Alert.alert("Error", "Failed to send reset code. Try again.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
            <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

            <Text style={[styles.title, themeStyles[theme].title]}>Verify Email</Text>

            <TextInput
                placeholder='Enter Your Email'
                placeholderTextColor={theme === "high-contrast" ? "#FFFF00" : theme === "dark" ? "#AAAAAA" : "#00000080"}
                style={[styles.textInput, themeStyles[theme].textInput]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleResetPassword}>
                <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Send Reset Code</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
                <Text>Remembered your password?</Text>
                <Pressable onPress={() => router.push('/authentication/login')}>
                    <Text style={[styles.signInText, themeStyles[theme].text]}> Sign In Here</Text>
                </Pressable>
            </View>
        </SafeAreaView>
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