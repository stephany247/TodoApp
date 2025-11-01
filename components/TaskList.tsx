// components/TaskList.tsx
import { FlatList, View, Text, Pressable } from "react-native";
import TaskItem from "./TaskItem";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import EmptyList from "./EmptyList";
import LoadingOverlay from "./LoadingOverlay";

export default function TaskList({
  data,
  onToggle,
  onDelete,
  colorScheme,
  activeCount,
  onClearCompleted,
  isLoading,
}: {
  data: any[];
  onToggle: (id: Id<"tasks">, current: boolean) => void;
  onDelete: (id: Id<"tasks">) => void;
  colorScheme?: string;
  activeCount: number;
  onClearCompleted: () => void;
  isLoading?: boolean;
}) {
  const listEmpty = !isLoading && (!data || data.length === 0);
  return (
    <View
      className="flex-1 flex-col -mt-20 px-6 h-max"
      importantForAccessibility={isLoading ? "no-hide-descendants" : "auto"}
      accessible
    >
      {/* Loader over the list if loading */}
      {isLoading ? <LoadingOverlay message="Loading todos…" /> : null}

      {listEmpty ? (
        <View
          className="w-full bg-card-light dark:bg-card-dark rounded-t-xl shadow-lg p-6"
          accessible
          accessibilityRole="summary"
          accessibilityLabel="No todos"
          accessibilityHint="There are no todos yet. Use the add control to create your first todo."
        >
          <EmptyList />
        </View>
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            accessibilityRole="list"
            className="rounded-t-xl shadow-lg h-fit shadow-bg-dark"
            renderItem={({ item }) => (
              <TaskItem
                item={item}
                onToggle={() => onToggle(item._id, item.isCompleted)}
                onDelete={() => onDelete(item._id)}
                colorScheme={colorScheme}
              />
            )}
          />
          <View
            className="flex-row items-center justify-between gap-4 bg-card-light dark:bg-card-dark p-3 w-full py-6 rounded-b-xl"
            accessible
            accessibilityRole="toolbar"
          >
            <Text
              className="font-josefin text-button-dark dark:text-button-light"
              accessibilityLiveRegion="polite"
              accessibilityLabel={`${activeCount} todos left`}
            >
              {activeCount} left
            </Text>
            <Pressable
              onPress={onClearCompleted}
              accessibilityRole="button"
              accessibilityLabel="Clear completed todos"
              accessibilityHint="Removes all completed todos from your list"
              accessible
            >
              <Text className="font-josefin text-button-dark dark:text-button-light">
                Clear Completed
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
