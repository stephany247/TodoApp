// components/LoadingOverlay.tsx
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

export default function LoadingOverlay({ message }: { message?: string }) {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
      <View className="p-6 rounded-lg bg-card-light dark:bg-card-dark items-center">
        <ActivityIndicator size="large" />
        {message ? <Text className="mt-3 font-josefin text-sm text-text-dark dark:text-text-light">{message}</Text> : null}
      </View>
    </View>
  );
}
