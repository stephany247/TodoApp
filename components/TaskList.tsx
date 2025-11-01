// components/TaskList.tsx
import { FlatList, View, Text, Pressable } from "react-native";
import TaskItem from "./TaskItem";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function TaskList({
  data,
  onToggle,
  onDelete,
  colorScheme,
  activeCount,
  onClearCompleted,
}: {
  data: any[];
  onToggle: (id: Id<"tasks">, current: boolean) => void;
  onDelete: (id: Id<"tasks">) => void;
  colorScheme?: string;
  activeCount: number;
  onClearCompleted: () => void;
}) {
  return (
    <View className="flex-1 flex-col -mt-20 px-6 h-max">
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        className="rounded-t-xl shadow-lg h-fit shadow-bg-dark"
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={() => onToggle(item._id, item.isCompleted)} onDelete={() => onDelete(item._id)} colorScheme={colorScheme} />
        )}
      />
      <View className="flex-row items-center justify-between gap-4 bg-card-light dark:bg-card-dark p-3 w-full py-6 rounded-b-xl">
        <Text className="font-josefin text-button-dark dark:text-button-light">{activeCount} left</Text>
        <Pressable onPress={onClearCompleted}>
          <Text className="font-josefin text-button-dark dark:text-button-light">Clear Completed</Text>
        </Pressable>
      </View>
    </View>
  );
}
