import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { AudioPlayer as AudioPlayerClass } from "@/audio/player";

interface AudioPlayerProps {
  audioUri: string | null;
}

export function AudioPlayer({ audioUri }: AudioPlayerProps) {
  const [playbackStatus, setPlaybackStatus] = useState<"playing" | "paused">("paused");
  const [audioPlayer] = useState(() => new AudioPlayerClass());

  useEffect(() => {
    if (audioUri) {
      audioPlayer.setStatusListener((status) => {
        setPlaybackStatus(status);
      });
      audioPlayer.loadAudio(audioUri);
    }

    return () => {
      audioPlayer.cleanup();
    };
  }, [audioUri]);

  const togglePlayPause = async () => {
    if (!audioUri) return;

    try {
      if (playbackStatus === "playing") {
        await audioPlayer.pause();
      } else {
        await audioPlayer.play();
      }
    } catch (error) {
      console.error("Failed to toggle play/pause:", error);
    }
  };

  return (
    <View className="items-center mb-6">
      {audioUri ? (
        <Pressable
          onPress={togglePlayPause}
          className="w-16 h-16 bg-yellow-300 rounded-full items-center justify-center"
        >
          <Ionicons
            name={playbackStatus === "playing" ? "pause" : "play"}
            size={32}
            color="black"
          />
        </Pressable>
      ) : (
        <Text className="text-gray-500">No audio available</Text>
      )}
    </View>
  );
}