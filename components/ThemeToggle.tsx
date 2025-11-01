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
    <Pressable onPress={onToggle}>
      <Ionicons name={colorScheme === "dark" ? "sunny" : "moon"} size={24} color="#fff" />
    </Pressable>
  );
}
