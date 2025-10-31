import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import "../global.css";

export default function App() {
  const [input, setInput] = useState("");
  return (
    <View className="flex flex-col items-center justify-center bg-white font-josefin">
      <ImageBackground
        source={require("../assets/images/bg/bg-mobile-light.jpg")}
        resizeMode="cover"
        className="w-full h-60 items-center justify-center p-6"
      >
        <View className="flex flex-row w-full justify-between items-center">
          <Text className="text-3xl font-bold text-white tracking-widest uppercase">
            Todo
          </Text>
          {/* <TouchableOpacity onPress={() => {}} className="active:opacity-80 transition"> */}
            <Ionicons name="sunny" size={24} color="white" />
          {/* </TouchableOpacity> */}
        </View>

        {/* Input */}
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-4 mt-6 w-full h-12">
          <View className="w-5 h-5 rounded-full border mr-3" />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Create a new todo..."
            className="w-full h-10 text-gray-800"
            // onSubmitEditing={handleAdd}
          />
        </View>
      </ImageBackground>
      {/* </View> */}
    </View>
  );
}
