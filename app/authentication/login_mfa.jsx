import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function login_mfa() {
    const router = useRouter();
    const [mfaCode, setMfaCode] = useState('');

    const handleVerifyResetMFA = async () => {
        if (!mfaCode) {
            Alert.alert("Error", "Please enter the verification code!");
            return;
        }

        try {
            /*
            
              Cognito MFA Verification Code Here
            
            */
            Alert.alert("Success", "MFA verified successfully!");
            router.push('/home_screen/home');
        } catch (error) {
            Alert.alert("Error", "Invalid MFA code. Try again.");
        }
    };

    const handleResendResetCode = async () => {
        try {
            /*
            
              Cognito Resend MFA Code Here
            
            */
            Alert.alert("Success", "A new verification code has been sent.");
        } catch (error) {
            Alert.alert("Error", "Failed to resend the verification code.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

            <Text style={styles.title}>Enter MFA Code</Text>

            <TextInput
                placeholder='Enter Verification Code'
                placeholderTextColor={Colors.L_GREY}
                style={styles.textInput}
                value={mfaCode}
                onChangeText={setMfaCode}
                keyboardType="numeric"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyResetMFA}>
                <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
                <Text>Didn't receive a code?</Text>
                <Pressable onPress={handleResendResetCode}>
                    <Text style={styles.resendText}> Resend Code</Text>
                </Pressable>
            </View>

            {/* <View style={styles.signInContainer}>
                <Text>Remembered your password?</Text>
                <Pressable onPress={() => router.push('/authentication/login')}>
                    <Text style={styles.signInText}> Sign In Here</Text>
                </Pressable>
            </View> */}
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
    resendContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    resendText: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    // signInContainer: {
    //     flexDirection: 'row',
    //     marginTop: 20,
    // },
    // signInText: {
    //     color: Colors.PRIMARY,
    //     fontWeight: 'bold',
    //     marginLeft: 5,
    // },
});