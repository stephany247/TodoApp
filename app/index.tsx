// App.tsx
import {
  ImageBackground,
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import "../global.css";
import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import Controls from "../components/Controls";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

const bgLight = require("../assets/images/bg/bg-mobile-light.jpg");
const bgDark = require("../assets/images/bg/bg-mobile-dark.jpg");

export default function App() {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const { colorScheme, toggle, isReady } = useTheme();
  const currentBg = colorScheme === "dark" ? bgDark : bgLight;
  const inputRef = useRef<TextInput>(null);

  // tasks
  const tasks = useQuery(api.tasks.getAll);
  const activeTasks = useQuery(api.tasks.getActive);
  const completedTasks = useQuery(api.tasks.getCompleted);
  const clearCompleted = useMutation(api.tasks.clearCompleted);
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.removeTask);

  const handleAdd = useCallback(async () => {
     if (!text.trim()) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    return;
  }
    try {
      await createTask({ text: text.trim() });
      setText("");
    } catch (e) {
      console.warn("create failed", e);
         await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [text, createTask]);

  const toggleTask = useCallback(
    async (id: Id<"tasks">, current: boolean) => {
      try {
        await updateTask({ id, isCompleted: !current });
      } catch (e) {
        console.warn("toggle failed", e);
      }
    },
    [updateTask]
  );

  const handleDeleteTask = useCallback(
    async (id: Id<"tasks">) => {
      try {
        await deleteTask({ id });
      } catch (e) {
        console.warn("delete failed", e);
      }
    },
    [deleteTask]
  );

  const handleClearCompleted = useCallback(async () => {
    try {
      await clearCompleted();
    } catch (e) {
      console.warn("clear failed", e);
    }
  }, [clearCompleted]);

  if (!isReady) return null;

  const displayed =
    filter === "all"
      ? (tasks ?? [])
      : filter === "active"
        ? (activeTasks ?? [])
        : (completedTasks ?? []);
  const listData = [...(displayed ?? [])].sort(
    (a, b) => b._creationTime - a._creationTime
  );
  // compute loading across queries (simple approach)
  const isLoading =
    tasks === undefined ||
    activeTasks === undefined ||
    completedTasks === undefined;

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

          <ThemeToggle colorScheme={colorScheme} onToggle={toggle} />
        </View>

        <TaskInput text={text} onChange={setText} onSubmit={handleAdd} />
      </ImageBackground>

      <TaskList
        data={listData}
        onToggle={toggleTask}
        onDelete={handleDeleteTask}
        colorScheme={colorScheme}
        activeCount={(activeTasks ?? []).length}
        onClearCompleted={handleClearCompleted}
        isLoading={isLoading}
      />

      <Controls filter={filter} setFilter={setFilter} />

      <Text className="text-center font-josefin text-placeholder-dark dark:text-placeholder-light mt-6">
        Drag and drop to reorder list
      </Text>
    </SafeAreaView>
  );
}
