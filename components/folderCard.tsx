import { View, Text } from 'react-native';

interface CardProps {
  name: string;
  count: number;
}

export default function Card({ name, count }: CardProps) {
  return (
    <View className="flex-row justify-between items-center p-4 bg-white rounded-2xl shadow-md border border-gray-200">
      <Text className="text-lg font-semibold text-gray-800">{name}</Text>
      <Text className="text-lg font-bold text-blue-500">{count}</Text>
    </View>
  );
}
