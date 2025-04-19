import { Stack } from "expo-router";
import { StatusBar } from "react-native"; // NEW
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <>
          <StatusBar backgroundColor="#003049" barStyle="light-content" />
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