// components/TaskInput.tsx
import React from "react";
import { View, TextInput } from "react-native";

export default function TaskInput({
  text,
  onChange,
  onSubmit,
}: {
  text: string;
  onChange: (t: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View className="flex flex-row items-center bg-card-light dark:bg-card-dark rounded-lg px-3 py-2 mb-4 mt-6 w-full">
      <View className="w-5 h-5 rounded-full border border-border-light dark:border-border-dark mr-3" />
      <TextInput
        value={text}
        onChangeText={onChange}
        placeholder="Create a new todo..."
        style={{ fontFamily: "josefin_400" }}
        className="h-fit text-text-dark dark:text-text-light placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark rounded-lg bg-transparent outline-none placeholder:font-josefin caret-blue-500 flex-1"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        accessibilityLabel="New todo"
        accessibilityHint="Enter the todo text, then submit to add"
      />
    </View>
  );
}
