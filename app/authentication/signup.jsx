import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

export default function Signup() {
  const router = useRouter();
  const { theme } = useTheme();

  // State to store input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Signup
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email address!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long!");
      return;
    }

    try {
      /*
      
        Cognito Code Here
      
      */

      Alert.alert("Success", "Account created successfully!");
      router.push('/authentication/login');

    } catch (error) {
      Alert.alert("Error", "Failed to create an account. Try again.");
    }
  };

  return (
    <ThemeProvider>
      <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
        <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

        <Text style={[styles.title, themeStyles[theme].title]}>Create New Account</Text>

        <TextInput
          placeholder='Username'
          placeholderTextColor="#00000080"
          style={[styles.textInput, themeStyles[theme].textInput]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder='Email'
          placeholderTextColor="#00000080"
          style={[styles.textInput, themeStyles[theme].textInput]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder='Password'
          secureTextEntry={true}
          placeholderTextColor="#00000080"
          style={[styles.textInput, themeStyles[theme].textInput]}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleSignup}>
          <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={themeStyles[theme].text}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/authentication/login')}>
            <Text style={[styles.signInText, themeStyles[theme].text]}> Sign In Here</Text>
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