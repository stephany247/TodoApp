import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  Platform,
  FlatList,
  ScrollView,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { useColorScheme } from "nativewind";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LinearGradient } from "expo-linear-gradient";
import { Id } from "@/convex/_generated/dataModel";

import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const bgLight = require("../assets/images/bg/bg-mobile-light.jpg");
const bgDark = require("../assets/images/bg/bg-mobile-dark.jpg");

const THEME_KEY = "todoApp:theme"; // storage key (change if you want)

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [text, setText] = useState("");
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isReady, setIsReady] = useState(false);

  const currentBg = colorScheme === "dark" ? bgDark : bgLight;
  // Load persisted theme on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === "light" || saved === "dark") {
          // use nativewind API to set the scheme explicitly
          setColorScheme(saved);
        } else {
          // follow system: you can call setColorScheme("system") or do nothing
          // setColorScheme("system"); // optional
        }
      } catch (e) {
        console.warn("Failed to load theme", e);
      } finally {
        setIsReady(true);
      }
    })();
  }, [setColorScheme]);

  // helper: toggle and persist + animate
  const handleToggleTheme = useCallback(async () => {
    // nice layout transition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // toggle in nativewind
    if (toggleColorScheme) {
      toggleColorScheme();
      const newTheme = colorScheme === "dark" ? "light" : "dark";
      try {
        await AsyncStorage.setItem(THEME_KEY, newTheme);
      } catch (e) {
        console.warn("Failed to save theme", e);
      }
    } else if (setColorScheme) {
      // fallback: manually set
      const newTheme = colorScheme === "dark" ? "light" : "dark";
      setColorScheme(newTheme);
      try {
        await AsyncStorage.setItem(THEME_KEY, newTheme);
      } catch (e) {
        console.warn("Failed to save theme", e);
      }
    }
  }, [colorScheme, toggleColorScheme, setColorScheme]);


  // Task handlers
  const tasks = useQuery(api.tasks.getAll);
  const activeTasks = useQuery(api.tasks.getActive);
  const completedTasks = useQuery(api.tasks.getCompleted);
  const clearCompleted = useMutation(api.tasks.clearCompleted);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.removeTask);

  const handleAdd = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await createTask({ text: text.trim() });
      setText("");
    } catch (e) {
      console.warn("Failed to create task", e);
    }
  }, [text, createTask]);

  const toggleTask = useCallback(
    async (id: Id<"tasks">, current: boolean) => {
      try {
        await updateTask({ id, isCompleted: !current });
      } catch (e) {
        console.warn("Failed to toggle task", e);
      }
    },
    [updateTask]
  );

  const handleDeleteTask = useCallback(
    async (id: Id<"tasks">) => {
      try {
        await deleteTask({ id });
      } catch (e) {
        console.warn("Failed to delete task", e);
      }
    },
    [deleteTask]
  );

  const displayedTasks =
    filter === "all"
      ? (tasks ?? [])
      : filter === "active"
        ? (activeTasks ?? [])
        : (completedTasks ?? []);

  const listData = [...(displayedTasks ?? [])].sort(
    (a, b) => b._creationTime - a._creationTime
  ); // newest first

  const handleClearCompleted = useCallback(async () => {
    try {
      await clearCompleted();
    } catch (e) {
      console.warn("Failed to clear completed task(s)", e);
    }
  }, [clearCompleted]);

  return (
    <SafeAreaView className="flex-1 flex-col items-center justify-center bg-bg-light dark:bg-bg-dark text-text-dark dark:text-text-light font-josefin text-lg min-h-screen h-full pt-0 pb-12">
      <ImageBackground
        source={currentBg}
        resizeMode="cover"
        className="w-full h-80 flex items-center justify-center p-6"
      >
        <View className="flex-row w-full justify-between items-center">
          <Text className="text-3xl font-bold text-white tracking-[0.35em] uppercase py-2">
            Todo
          </Text>

          <Pressable onPress={handleToggleTheme}>
            <Ionicons
              name={colorScheme === "dark" ? "sunny" : "moon"}
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>

        {/* Input */}
        <View className="flex flex-row items-center bg-card-light dark:bg-card-dark rounded-lg p-3 mb-4 mt-6 w-full">
          <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark mr-3" />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Create a new todo..."
            style={{ fontFamily: "josefin_400" }}
            className="h-10 text-text-dark dark:text-text-light placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark  rounded-lg bg-transparent outline-none placeholder:font-josefin caret-blue-500 flex-1"
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </View>
      </ImageBackground>

      <View className="flex-1 flex-col -mt-20 px-6 h-max">
        <FlatList
          data={listData}
          keyExtractor={(item) => item._id}
          className="rounded-t-xl shadow-lg h-fit shadow-bg-dark"
          renderItem={({ item }) => (
            <View className="flex flex-row justify-between items-center gap-8 w-full bg-card-light dark:bg-card-dark p-2 border-b border-border-light dark:border-border-dark">
              <Pressable
                className="flex-1 flex-row items-center gap-2 h-12"
                onPress={() => toggleTask(item._id, item.isCompleted)}
              >
                {item.isCompleted ? (
                  <LinearGradient
                    colors={["hsl(192 100% 67%)", "hsl(280 87% 65%)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    // className="w-5 h-5 rounded-full flex items-center justify-center border border-border-light dark:border-border-dark"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 9999, // same as rounded-full
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.3)", // or use your theme border color
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text className="text-white text-xs">✓</Text>
                  </LinearGradient>
                ) : (
                  <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark" />
                )}

                {/* Title */}
                <Text
                  className={`text-wrap font-josefin ${
                    item.isCompleted
                      ? "line-through text-strike-light dark:text-strike-dark"
                      : "text-text-dark dark:text-text-light"
                  }`}
                >
                  {item.text}
                </Text>
              </Pressable>
              <Pressable onPress={() => handleDeleteTask(item._id)}>
                <EvilIcons
                  name="close"
                  size={24}
                  color={
                    colorScheme === "dark"
                      ? "hsla(237, 14%, 26%, 1)"
                      : "hsla(236, 32%, 92%, 1)"
                  } // example
                />
              </Pressable>
            </View>
          )}
        />
        <View className="flex-row items-center justify-between gap-4 bg-card-light dark:bg-card-dark p-3 w-full py-6 rounded-b-xl">
          <Text className="font-josefin text-button-dark dark:text-button-light">
            {(activeTasks ?? []).length} left
          </Text>
          <Pressable onPress={handleClearCompleted}>
            <Text className="font-josefin text-button-dark dark:text-button-light">
              Clear Completed
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Controls */}
      <View className="w-full flex-col justify-between items-center gap-4 pb-4 px-6 mt-6">
        <View className="flex-row gap-8 items-center justify-center w-full bg-white dark:bg-card-dark text-text-dark dark:text-text-light p-4 rounded-xl shadow-md shadow-bg-dark">
          <Pressable onPress={() => setFilter("all")}>
            <Text
              className={`font-josefin-bold ${filter === "all" ? "text-blue opacity-100" : "text-button-dark dark:text-button-light opacity-50"}`}
            >
              All
            </Text>
          </Pressable>
          <Pressable onPress={() => setFilter("active")}>
            <Text
              className={`font-josefin-bold ${filter === "active" ? "text-blue opacity-100" : "text-button-dark dark:text-button-light opacity-50"}`}
            >
              Active
            </Text>
          </Pressable>
          <Pressable onPress={() => setFilter("completed")}>
            <Text
              className={`font-josefin-bold ${filter === "completed" ? "text-blue opacity-100" : "text-button-dark dark:text-button-light opacity-50"}`}
            >
              Completed
            </Text>
          </Pressable>
        </View>
      </View>
      <Text className="text-center font-josefin text-placeholder-dark dark:text-placeholder-light mt-6">
        Drag and drop to reorder list
      </Text>
    </SafeAreaView>
  );
}
