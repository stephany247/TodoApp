import {
  JosefinSans_400Regular,
  JosefinSans_700Bold,
  useFonts,
} from "@expo-google-fonts/josefin-sans";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const convex = new ConvexReactClient("https://keen-pigeon-796.convex.cloud", {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const [fontloaded, fonterror] = useFonts({
    josefin_400: JosefinSans_400Regular,
    josefin_700: JosefinSans_700Bold,
  });

  useEffect(() => {
    if (fontloaded || fonterror) {
      SplashScreen.hideAsync();
    }
  }, [fontloaded, fonterror]);

  if (!fontloaded && !fonterror) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}
