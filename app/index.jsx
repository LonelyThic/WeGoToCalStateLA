import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../constant/Colors";
import Corners from "../constant/Corners";

const TOP_BUFFER = 60;
const BOTTOM_BUFFER = 60;


export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in to full opacity
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.PRIMARY, Colors.CREAM]} // Adjust gradient colors as needed
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.Image
          source={require("../assets/images/P_Logo.png")}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text style={styles.title}>WeGoToCalStateLA</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/signup")}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => router.push("/authentication/login")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => router.push("/debug")}>
            <Text style={styles.buttonText}>Debug</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: TOP_BUFFER,
    paddingBottom: BOTTOM_BUFFER,
  },
  safeArea: {
    flex: 1,
  },
  logo: {
    width: 320,
    height: 360,
    alignSelf: "center",
    marginVertical: 20,
  },
  content: {
    padding: 25,
    backgroundColor: Colors.PRIMARY,
    height: "50%",
    borderRadius: Corners.DEFAULT,
    marginHorizontal: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.WHITE,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.BLACK,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: Colors.PRIMARY,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.WHITE,
  },
});