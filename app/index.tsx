import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colorScheme, useColorScheme, vars } from "nativewind";
import "../global.css";

// Preload both images at the top
const bgLight = require("../assets/images/bg/bg-mobile-light.jpg");
const bgDark = require("../assets/images/bg/bg-mobile-dark.jpg");

export default function App() {
  const [input, setInput] = useState("");
  // const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const { colorScheme, toggleColorScheme } = useColorScheme();


  const currentBg = colorScheme === "dark" ? bgDark : bgLight;

  return (
    <View
      className={`flex flex-col items-center justify-center bg-white dark:bg-gray-900 font-josefin`}
    >
      <ImageBackground
        source={currentBg}
        resizeMode="cover"
        className="w-full h-60 items-center justify-center p-6"
      >
        <View className="flex flex-row w-full justify-between items-center">
          <Text className="text-3xl font-bold text-white tracking-[0.35em] uppercase mt-4 py-2">
            Todo
          </Text>

          <Pressable onPress={toggleColorScheme}>
            <Text
              className=" text-white font-bold"
            >
              {colorScheme === "dark" ? (
                <Ionicons name="sunny" size={24} />
              ) : (
                <Ionicons name="moon" size={24} />
              )}
            </Text>
          </Pressable>
        </View>

        {/* Input */}
        <View
          className={`flex-row items-center bg-card-light dark:bg-card-dark rounded-lg p-3 mb-4 mt-6 w-full h-12`}
        >
          <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark mr-3" />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Create a new todo..."
            className="h-10 text-sm rounded-lg bg-transparent outline-none placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark placeholder:font-josefin caret-blue-500"
          />
        </View>
      </ImageBackground>
    </View>
  );
}
