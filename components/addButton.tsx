import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colorScheme } from "nativewind";

export function AddButton(props: { onPress: () => void; className: string }) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      className={`w-16 h-16 bg-blue-400 dark:bg-blue-800 rounded-3xl items-center justify-center shadow-md ${props.className}`}
    >
      {colorScheme.get() === "dark" ? (
        <Feather name="plus" size={32} color="#f9fafb" />
      ) : (
        <Feather name="plus" size={32} color="black" />
      )}
    </TouchableOpacity>
  );
}
