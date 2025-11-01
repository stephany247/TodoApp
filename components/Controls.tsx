// components/Controls.tsx
import { View, Pressable, Text } from "react-native";
import React from "react";

export default function Controls({
  filter,
  setFilter,
}: {
  filter: "all" | "active" | "completed";
  setFilter: (v: "all" | "active" | "completed") => void;
}) {
  return (
    <View className="w-full flex-col justify-between items-center gap-4 pb-4 px-6 mt-6">
      <View className="flex-row gap-8 items-center justify-center w-full bg-white dark:bg-card-dark text-text-dark dark:text-text-light p-4 rounded-xl shadow-md shadow-bg-dark">
        <Pressable onPress={() => setFilter("all")}>
          <Text className={`font-josefin-bold ${filter === "all" ? "text-blue opacity-100" : "text-button-dark dark:text-button-light opacity-50"}`}>All</Text>
        </Pressable>
        <Pressable onPress={() => setFilter("active")}>
          <Text className={`font-josefin-bold ${filter === "active" ? "text-blue opacity-100" : "text-button-dark dark:text-button-light opacity-50"}`}>Active</Text>
        </Pressable>
        <Pressable onPress={() => setFilter("completed")}>
          <Text className={`font-josefin-bold ${filter === "completed" ? "text-blue opacity-100" : "text-button-dark dark:text-button-light opacity-50"}`}>Completed</Text>
        </Pressable>
      </View>
    </View>
  );
}
