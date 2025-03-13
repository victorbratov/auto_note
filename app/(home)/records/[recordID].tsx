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
import { AudioPlayer } from "@/components/AudioPlayer";

import { ScrollView } from "react-native";
import { MarkdownBox } from "@/components/MarkdownBox";
import { TextBox } from "@/components/TextBox";

export default function RecordPage() {
  const { recordID } = useLocalSearchParams();
  const [record, setRecord] = useState<Record | null>(null);
  useEffect(() => {
    const loadRecord = async () => {
      const recordData = await getRecordById(Number(recordID));
      if (recordData) {
        setRecord(recordData);
      }
    };
    loadRecord();
  }, [recordID]);

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

      <ScrollView className="flex-1 p-4">
        <AudioPlayer audioUri={record.audioUri} />
        <View className="h-px bg-gray-200 w-full mb-6" />
        <MarkdownBox uri={record.markdownUri!} />
        <TextBox uri={record.textUri!} />
      </ScrollView>
    </SafeAreaView>
  );
}
