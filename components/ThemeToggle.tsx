// components/ThemeToggle.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import React from "react";

export default function ThemeToggle({
  colorScheme,
  onToggle,
}: {
  colorScheme: string | undefined;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      accessibilityHint="Switch between light and dark theme"
      accessible
    >
      <Ionicons
        name={colorScheme === "dark" ? "sunny" : "moon"}
        size={24}
        color="#fff"
      />
    </Pressable>
  );
}
