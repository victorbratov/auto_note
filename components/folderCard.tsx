import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AudioPlayer } from "@/audio/player";

interface CardProps {
  name: string;
  count: number;
  recordingUri?: string;
}

export default function Card({ name, count, recordingUri }: CardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player] = useState(new AudioPlayer());

  const handlePress = async () => {
    if (!recordingUri) return;

    try {
      if (isPlaying) {
        await player.stop();
        setIsPlaying(false);
      } else {
        console.log("Playing audio:", recordingUri);
        await player.loadAudio(recordingUri);
        await player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row justify-between items-center p-4 bg-white rounded-2xl shadow-md border border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">{name}</Text>
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-blue-500 mr-2">{count}</Text>
          {isPlaying && <Text className="text-sm text-green-500">Playing</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
