import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { AudioPlayer as AudioPlayerClass } from "@/audio/player";

const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
interface AudioPlayerProps {
  audioUri: string | null;
}

export function AudioPlayer({ audioUri }: AudioPlayerProps) {
  const [playbackStatus, setPlaybackStatus] = useState<"playing" | "paused">(
    "paused",
  );
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (playbackStatus === "playing" && !isDragging) {
      progressInterval = setInterval(async () => {
        const progress = await audioPlayer.getProgress();
        setPosition(progress.position);
        setDuration(progress.duration);
      }, 100);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [playbackStatus, isDragging]);
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
    <View className="w-full px-4 my-6">
      {audioUri ? (
        <View className="bg-white rounded-xl p-4 shadow-md">
          <View className="flex-row">
            <Pressable
              onPress={togglePlayPause}
              className="w-16 h-16 bg-yellow-300 rounded-full items-center justify-center mr-4"
            >
              <Ionicons
                name={playbackStatus === "playing" ? "pause" : "play"}
                size={32}
                color="black"
              />
            </Pressable>

            <View className="flex-1 justify-center">
              <Pressable
                className="w-full h-8 justify-center"
                onLayout={(e) => {
                  setProgressBarWidth(e.nativeEvent.layout.width);
                }}
                onTouchStart={() => setIsDragging(true)}
                onTouchMove={async (e) => {
                  const touch = e.nativeEvent.touches[0];
                  const percentage = Math.max(
                    0,
                    Math.min(1, touch.locationX / progressBarWidth),
                  );
                  const newPosition = percentage * duration;
                  setPosition(newPosition);
                }}
                onTouchEnd={async (e) => {
                  const touch = e.nativeEvent.changedTouches[0];
                  const percentage = Math.max(
                    0,
                    Math.min(1, touch.locationX / progressBarWidth),
                  );
                  const newPosition = percentage * duration;

                  await audioPlayer.seekTo(newPosition);
                  setPosition(newPosition);
                  setIsDragging(false);
                }}
              >
                <View className="w-full h-2 bg-gray-200 rounded-full">
                  <View
                    className="h-full bg-yellow-300 rounded-full"
                    style={{ width: `${(position / duration) * 100}%` }}
                  />
                </View>
              </Pressable>

              <View className="flex-row justify-between mt-0.5">
                <Text className="text-xs text-gray-500">
                  {formatTime(position)}
                </Text>
                <Text className="text-xs text-gray-500">
                  {formatTime(duration)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-gray-500 text-center">No audio available</Text>
      )}
    </View>
  );
}
