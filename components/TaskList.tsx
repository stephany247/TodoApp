// TaskListDraggable.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskItem from "./TaskItem";
import EmptyList from "./EmptyList";
import LoadingOverlay from "./LoadingOverlay";
import type { Id } from "@/convex/_generated/dataModel";

const STORAGE_KEY = "tasks_order_v1";

type TaskListDraggableProps = {
  data: any[];
  onToggle: (id: Id<"tasks">, current: boolean) => void;
  onDelete: (id: Id<"tasks">) => void | Promise<void>;
  colorScheme?: string;
  activeCount: number;
  onClearCompleted: () => void | Promise<void>;
  isLoading?: boolean;
  onReorder?: (newData: any[]) => void;
};

export default function TaskListDraggable({
  data,
  onToggle,
  onDelete,
  colorScheme,
  activeCount,
  onClearCompleted,
  isLoading,
  onReorder,
}: TaskListDraggableProps) {
  const [listData, setListData] = useState<any[]>(() => data ?? []);
  const [rehydrated, setRehydrated] = useState(false);

  // small debounce helper
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function debouncedSaveOrder(items: any[], delay = 500) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveOrder(items).catch((e) => console.warn("Failed debounced save:", e));
      saveTimer.current = null;
    }, delay);
  }

  async function saveOrder(items: any[]) {
    try {
      const ids = items.map((it) => String(it._id));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn("Failed to persist task order:", err);
    }
  }

  // Build ordered list: NEW items go to the TOP, then preserved stored order
  function buildOrderedListFromIds(ids: string[], items: any[]) {
    const map = new Map(items.map((it) => [String(it._id), it]));

    // items present in saved ids, in that order
    const orderedExisting: any[] = [];
    for (const id of ids) {
      const it = map.get(String(id));
      if (it) {
        orderedExisting.push(it);
        map.delete(String(id));
      }
    }

    // remaining items are new -> place them at the start (top)
    const newItems: any[] = [];
    for (const it of items) {
      if (map.has(String(it._id))) {
        newItems.push(it);
        map.delete(String(it._id));
      }
    }

    return [...newItems, ...orderedExisting];
  }

  async function loadOrderAndApply() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const ordered = buildOrderedListFromIds(ids, data ?? []);
        setListData(ordered);
      } else {
        setListData(data ?? []);
      }
    } catch (err) {
      console.warn("Failed to load saved task order:", err);
      setListData(data ?? []);
    } finally {
      setRehydrated(true);
    }
  }

  // Rehydrate on mount
  useEffect(() => {
    loadOrderAndApply();
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconcile when parent data changes, preserving saved order and placing new items on top
  useEffect(() => {
    if (!rehydrated) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const ids: string[] = JSON.parse(raw);
          const ordered = buildOrderedListFromIds(ids, data ?? []);
          setListData(ordered);
        } else {
          setListData(data ?? []);
        }
      } catch (err) {
        console.warn("Error reconciling task order:", err);
        setListData(data ?? []);
      }
    })();
  }, [data, rehydrated]);

  if (isLoading || !rehydrated)
    return <LoadingOverlay message="Loading todos…" />;

  if (!listData || listData.length === 0) {
    return (
      <View
        accessible
        accessibilityRole="summary"
        accessibilityLabel="No todos"
      >
        <EmptyList />
      </View>
    );
  }

  // Called when user finishes dragging — save immediately (final intent)
  async function handleDragEnd({ data: newData }: { data: any[] }) {
    setListData(newData);
    await saveOrder(newData);
    onReorder?.(newData);
  }

  // Deletes a single item: call parent, remove id from storage, update local list, notify reorder
  async function handleDelete(id: string | number) {
    const sid = String(id);
    // call parent (may be async)
    try {
      await onDelete(id as Id<"tasks">);
    } catch (err) {
      console.warn("onDelete threw:", err);
    }

    // remove id from stored order if present
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const remaining = ids.filter((x) => x !== sid);
      // use debounced save to avoid a burst if many deletes happen
      debouncedSaveOrder(
        remaining
          .map((x) => listData.find((it) => String(it._id) === x))
          .filter(Boolean)
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    } catch (err) {
      console.warn("Failed to update stored order after delete:", err);
    }

    // update local list immediately
    const newList = listData.filter((it) => String(it._id) !== sid);
    setListData(newList);
    onReorder?.(newList);
  }

  // Clear Completed handler that also updates AsyncStorage
  async function handleClearCompleted() {
    const completedIds = listData
      .filter((it) => it.isCompleted)
      .map((it) => String(it._id));
    if (completedIds.length === 0) {
      await onClearCompleted();
      return;
    }

    // call parent
    try {
      await onClearCompleted();
    } catch (err) {
      console.warn("onClearCompleted threw:", err);
    }

    // Remove completed IDs from stored order
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const remaining = ids.filter((id) => !completedIds.includes(String(id)));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    } catch (err) {
      console.warn(
        "Failed to update stored order after clearing completed:",
        err
      );
    }

    // Update local listData immediately
    const newList = listData.filter(
      (it) => !completedIds.includes(String(it._id))
    );
    setListData(newList);
    onReorder?.(newList);
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator activeScale={1.03}>
        <TaskItem
          item={item}
          onToggle={() => onToggle(item._id, item.isCompleted)}
          // use wrapper so storage stays consistent
          onDelete={() => handleDelete(item._id)}
          colorScheme={colorScheme}
          onLongPress={drag}
          dragging={isActive}
        />
      </ScaleDecorator>
    );
  };

  return (
    <View className="flex-1 flex-col -mt-20 px-6">
      <View className="w-full bg-card-light dark:bg-card-dark rounded-t-xl shadow-lg">
        <DraggableFlatList
          data={listData}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          activationDistance={10}
          className="rounded-t-xl"
        />
      </View>
      
      <View
        className="flex-row items-center justify-between gap-4 bg-card-light dark:bg-card-dark px-3 w-full py-6 rounded-b-xl shadow-md shadow-bg-dark"
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
          onPress={handleClearCompleted}
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
    </View>
  );
}
