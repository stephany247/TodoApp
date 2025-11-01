// components/EmptyState.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";

export default function EmptyList() {
  return (
    <View className="w-full items-center py-12">
      <Text className="font-josefin text-lg text-text-dark dark:text-text-light mb-2">
        Nothing here yet
      </Text>
      <Text className="font-josefin text-sm text-placeholder-dark dark:text-placeholder-light mb-4 text-center px-6">
        Add your first todo to get started.
      </Text>
    </View>
  );
}
