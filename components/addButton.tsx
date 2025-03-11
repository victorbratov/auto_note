import { Text, TouchableOpacity, View } from "react-native";

export function AddButton(props: { onPress: () => void, className: string }) {
  return (
    <TouchableOpacity onPress={props.onPress} className={`p-4 bg-blue-500 rounded-full ${props.className}`}>
      <Text className="text-white text-xl">+</Text>
    </TouchableOpacity>
  );
}
