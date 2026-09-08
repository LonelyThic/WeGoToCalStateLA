import { useColorScheme } from "react-native";
import { Colors } from "../constant/Colors";

export function useTheme() {
  const scheme = "dark";
  const base = scheme === "dark" ? Colors.dark : Colors.light;

  return {
    bg: Colors.BACKGROUND_SECONDARY,
    card: scheme === "dark" ? Colors.GRAY_800 : Colors.WHITE,
    text: base.text,
    subtext: Colors.TEXT_MUTED,
    border: Colors.BORDER,
    primary: Colors.PRIMARY,
    accent: Colors.SECONDARY,
  };
}
