import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  Platform,
  FlatList,
} from "react-native";
import { useColorScheme } from "nativewind";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LinearGradient } from "expo-linear-gradient";
import { Id } from "@/convex/_generated/dataModel";

// only require web CSS on web
if (Platform.OS === "web") require("../global.css");

const bgLight = require("../assets/images/bg/bg-mobile-light.jpg");
const bgDark = require("../assets/images/bg/bg-mobile-dark.jpg");

export default function App() {
  const [text, setText] = useState("");
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const currentBg = colorScheme === "dark" ? bgDark : bgLight;

  const tasks = useQuery(api.tasks.get);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);

  const handleAdd = async () => {
    if (!text.trim()) return;
    await createTask({ text: text.trim() });
    setText("");
  };

  const toggleTask = async (id: Id<"tasks">, current: boolean) => {
    await updateTask({ id, isCompleted: !current });
  };

  return (
    <View className="flex flex-col items-center justify-center bg-bg-light dark:bg-bg-dark text-text-dark dark:text-text-light font-josefin min-h-screen h-full pt-40">
      <ImageBackground
        source={currentBg}
        resizeMode="cover"
        className="w-full h-60 items-center justify-center p-6"
      >
        <View className="flex-row w-full justify-between items-center">
          <Text className="text-3xl font-bold text-white tracking-[0.35em] uppercase mt-4 py-2">
            Todo
          </Text>

          <Pressable onPress={() => toggleColorScheme && toggleColorScheme()}>
            <Ionicons
              name={colorScheme === "dark" ? "sunny" : "moon"}
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>

        {/* Input */}
        <View className="flex-row items-center bg-card-light dark:bg-card-dark rounded-lg p-3 mb-4 mt-6 w-full h-12">
          <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark mr-3" />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Create a new todo..."
            className="h-10 text-sm text-text-dark dark:text-text-light rounded-lg bg-transparent outline-none placeholder:font-josefin caret-blue-500 flex-1"
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </View>
      </ImageBackground>
      <View className="flex flex-col gap-12 items-center mx-6 rounded-[16px]">
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View className="flex flex-row justify-between items-center w-full bg-card-light dark:bg-card-dark p-2 border-b border-border-light dark:border-border-dark">
              <Pressable
                className="flex flex-row items-center gap-2 py-4"
                onPress={() => toggleTask(item._id, item.isCompleted)}
              >
                {item.isCompleted ? (
                  <LinearGradient
                    colors={["hsl(192 100% 67%)", "hsl(280 87% 65%)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center border border-border-light dark:border-border-dark"
                  >
                    <Text className="text-white text-xs">✓</Text>
                  </LinearGradient>
                ) : (
                  <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark" />
                )}
                {/* Title */}

                <Text
                  className={`text-wrap ${
                    item.isCompleted
                      ? "line-through text-strike-light dark:text-strike-dark"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {item.text}
                </Text>
              </Pressable>
              <Pressable>
                <EvilIcons
                  name="close"
                  size={24}
                  className="text-border-light dark:text-border-dark"
                />
              </Pressable>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
}
