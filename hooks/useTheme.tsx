// hooks/useTheme.tsx
import { useCallback, useEffect, useState } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

const KEY = "todoApp:theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function useTheme() {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === "light" || saved === "dark") {
          setColorScheme(saved);
        }
      } catch (e) {
        console.warn("load theme failed", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, [setColorScheme]);

  const toggle = useCallback(async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    if (toggleColorScheme) toggleColorScheme();
    else setColorScheme(newTheme);
    try {
      await AsyncStorage.setItem(KEY, newTheme);
    } catch (e) {
      console.warn("save theme failed", e);
    }
  }, [colorScheme, toggleColorScheme, setColorScheme]);

  return { colorScheme, toggle, isReady };
}
