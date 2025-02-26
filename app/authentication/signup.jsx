import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function Signup() {
  const router = useRouter();

  // State to store input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Signup
  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      // Create a new user object
      const newUser = { username, email, password };

      // Save user to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      Alert.alert("Success", "Account created successfully!");

      // Navigate to login screen
      router.navigate('../authentication/login');
    } catch (error) {
      Alert.alert("Error", "Failed to create an account. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

      <Text style={styles.title}>Create New Account</Text>

      <TextInput
        placeholder='Username'
        placeholderTextColor="#00000080"
        style={styles.textInput}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder='Email'
        placeholderTextColor="#00000080"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder='Password'
        secureTextEntry={true}
        placeholderTextColor="#00000080"
        style={styles.textInput}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text>Already have an account?</Text>
        <Pressable onPress={() => router.navigate('../authentication/login')}>
          <Text style={styles.signInText}> Sign In Here</Text>
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
    backgroundColor: Colors.SECONDARY,
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

