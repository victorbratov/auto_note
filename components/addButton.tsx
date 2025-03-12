import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export function AddButton(props: { onPress: () => void; className: string }) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      className={`w-16 h-16 bg-blue-400 rounded-3xl items-center justify-center shadow-md ${props.className}`}
    >
      <Feather name="plus" size={32} color="black" />
    </TouchableOpacity>
  );
}
