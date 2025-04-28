import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  useEffect(() => {
    const updateNavBar = async () => {
      try {
        await NavigationBar.setBackgroundColorAsync('#1F4388');
        await NavigationBar.setButtonStyleAsync('light'); // 'light' or 'dark'
      } catch (e) {
        console.warn("Failed to set nav bar color:", e);
      }
    };
    updateNavBar();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <>
          <StatusBar backgroundColor="#1F4388" barStyle="light-content" />
        </>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}