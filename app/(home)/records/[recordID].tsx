import { Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getRecordById } from "@/db/quieries";
import { Record } from "@/db/schema";
import { AudioPlayer } from "@/audio/player";

export default function RecordPage() {
  const { recordID } = useLocalSearchParams();
  const [record, setRecord] = useState<Record | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<"playing" | "paused">(
    "paused",
  );
  const [audioPlayer] = useState(() => new AudioPlayer());

  useEffect(() => {
    const loadRecord = async () => {
      const recordData = await getRecordById(Number(recordID));
      if (recordData) {
        setRecord(recordData);
        if (recordData.audioUri) {
          audioPlayer.setStatusListener((status) => {
            setPlaybackStatus(status);
          });
          await audioPlayer.loadAudio(recordData.audioUri);
        }
      }
    };
    loadRecord();

    return () => {
      audioPlayer.cleanup();
    };
  }, [recordID]);

  const togglePlayPause = async () => {
    if (!record?.audioUri) return;

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

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Record not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#FDE047" />
      <View className="bg-yellow-300 rounded-b-3xl">
        <View className="flex-row items-center p-4">
          <Link href="../" asChild>
            <Pressable className="mr-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          </Link>
          <Text className="text-black text-3xl font-bold">{record.name}</Text>
        </View>
      </View>

      <View className="flex-1 items-center justify-center p-4">
        {record.audioUri ? (
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
    </SafeAreaView>
  );
}
