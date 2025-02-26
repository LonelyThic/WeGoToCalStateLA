import { useRouter } from "expo-router";
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../constant/Colors";

export default function Signup() {

  const router = useRouter();

  return (
    <SafeAreaView style={{
      flex: 1,
      alignItems: 'center',  // Ensures everything inside is centered
      justifyContent: 'center',
      padding: 25,
      backgroundColor: Colors.SECONDARY,
      width: '100%', // Make sure SafeAreaView spans full width
    }}>

      <Image source={require('../../assets/images/CSULA.png')}
        style={{
          width: 180,
          height: 200,
          padding: 25,
          alignSelf: 'center'
        }}
      />

      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
      }}>Welcome Back!</Text>

      <TextInput placeholder='Username' placeholderTextColor="#00000080" style={styles.textInput} />
      <TextInput placeholder='Password' secureTextEntry={true} placeholderTextColor="#00000080" style={styles.textInput} />

      <TouchableOpacity style={{
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        width: '100%',
        height: 60,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: Colors.WHITE,
          fontSize: 20,
          fontWeight: 'bold',
        }}>
          Login
        </Text>
      </TouchableOpacity>

      <View style={{
        flexDirection: 'row',
        marginTop: 20,
      }}>
        <Text>Don't have an account?</Text>
        <Pressable onPress={()=>router.push('../authentication/signup')}>
          <Text style={{
            color: Colors.PRIMARY,
            fontWeight: 'bold',
            marginLeft: 5,
          }}> Sign Up Here</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
  }
});