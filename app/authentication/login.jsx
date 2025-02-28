import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function Login() {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      /*
      
        Cognito Code Here
      
      */
      router.push('/authentication/login_mfa');

    } catch (error) {
      Alert.alert("Error", "Failed to login. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/CSULA.png')} style={styles.logo} />

      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        placeholder='Username'
        placeholderTextColor="#00000080"
        style={styles.textInput}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder='Password'
        secureTextEntry={true}
        placeholderTextColor="#00000080"
        style={styles.textInput}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text>Don't have an account?</Text>
        <Pressable onPress={() => router.push('/authentication/signup')}>
          <Text style={styles.signUpText}> Sign Up Here</Text>
        </Pressable>
      </View>

      <View style={styles.signUpContainer}>
        <Text>Forgot your password?</Text>
        <Pressable onPress={() => router.push('/authentication/verify_email')}>
          <Text style={styles.signUpText}> Reset Password Here</Text>
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
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signUpText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});