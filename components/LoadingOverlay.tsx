// components/LoadingOverlay.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator, Text, AccessibilityInfo } from "react-native";

export default function LoadingOverlay({ message }: { message?: string }) {
  useEffect(() => {
    // Announce loading for screen reader users
    const announce = message ?? "Loading todos";
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      if (enabled) {
        AccessibilityInfo.announceForAccessibility(announce);
      }
    });
  }, [message]);

  return (
    <View
      className="absolute inset-0 z-50 items-center justify-center bg-black/40"
      // overlay should behave like a modal to screen readers
      accessible
      accessibilityViewIsModal={true}
      accessibilityLabel={message ?? "Loading todos"}
    >
      <View className="p-6 rounded-lg bg-card-light dark:bg-card-dark items-center">
        <ActivityIndicator size="large" />
        {message ? (
          <Text className="mt-3 font-josefin text-sm text-text-dark dark:text-text-light">
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
