import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); // Access theme state

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      router.push('../home_screen/home');
    } catch (error) {
      Alert.alert("Error", "Failed to login. Try again.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles[theme].container]}>
      <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

      <Text style={[styles.title, themeStyles[theme].title]}>Welcome Back!</Text>

      <TextInput
        placeholder='Username'
        placeholderTextColor={theme === "high-contrast" ? "#FFFF00" : theme === "dark" ? "#AAAAAA" : "#00000080"}
        style={[styles.textInput, themeStyles[theme].textInput]}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder='Password'
        secureTextEntry={true}
        placeholderTextColor={theme === "high-contrast" ? "#FFFF00" : theme === "dark" ? "#AAAAAA" : "#00000080"}
        style={[styles.textInput, themeStyles[theme].textInput]}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity style={[styles.button, themeStyles[theme].button]} onPress={handleLogin}>
        <Text style={[styles.buttonText, themeStyles[theme].buttonText]}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={themeStyles[theme].text}>Don't have an account?</Text>
        <Pressable onPress={() => router.push('/authentication/signup')}>
          <Text style={styles.signUpText}> Sign Up Here</Text>
        </Pressable>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={themeStyles[theme].text}>Forgot your password?</Text>
        <Pressable onPress={() => router.push('/authentication/verify_email')}>
          <Text style={styles.signUpText}> Reset Password Here</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Base Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
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
  },
  button: {
    padding: 10,
    width: '100%',
    height: 60,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signUpText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "60%",
  },
});

// Theme Styles
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