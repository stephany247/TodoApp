// components/TaskItem.tsx
import { View, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import React from "react";

export default function TaskItem({
  item,
  onToggle,
  onDelete,
  colorScheme,
  onLongPress,
  dragging,
}: {
  item: any;
  onToggle: () => void;
  onDelete: () => void;
  colorScheme?: string;
  onLongPress?: () => void;
  dragging?: boolean;
}) {
  const dragBg = colorScheme === "dark" ? "#1f2937" : "#eef2ff"; // dark/light
  const dragIcon = colorScheme === "dark" ? "#9ca3af" : "#374151";
  return (
    <View
      className="flex flex-row justify-between items-center gap-8 w-full bg-card-light dark:bg-card-dark p-2 border-b border-border-light dark:border-border-dark"
      style={dragging && { backgroundColor: dragBg  }}
    >
      <Pressable
        className="flex-1 flex-row items-center gap-2 h-12"
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityLabel={`Todo: ${item.text}`}
        accessibilityHint="Double tap to toggle completed"
        accessibilityState={{ checked: item.isCompleted }}
        accessible
        onLongPress={onLongPress}
        style={dragging ? { opacity: 0.8 } : null}
      >
        {item.isCompleted ? (
          <LinearGradient
            colors={["hsl(192 100% 67%)", "hsl(280 87% 65%)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 20,
              height: 20,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-white text-xs">✓</Text>
          </LinearGradient>
        ) : (
          <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark" />
        )}

        <Text
          className={`text-wrap font-josefin ${item.isCompleted ? "line-through text-strike-light dark:text-strike-dark" : "text-text-dark dark:text-text-light"}`}
        >
          {item.text}
        </Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Delete todo: ${item.text}`}
        accessibilityHint="Double tap to delete this todo"
        accessible
      >
        <EvilIcons
          name="close"
          size={24}
          color={
            colorScheme === "dark"
              ? "hsla(237, 14%, 26%, 1)"
              : "hsla(236, 32%, 92%, 1)"
          }
        />
      </Pressable>
    </View>
  );
}
