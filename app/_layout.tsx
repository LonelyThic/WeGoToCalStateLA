import { Slot } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </ThemeProvider>
  );
}