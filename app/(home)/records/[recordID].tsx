import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable, Switch, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MarkdownBox } from "@/components/MarkdownBox";
import { TextBox } from "@/components/TextBox";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useRecord } from "@/db/hooks";
import { useAuth } from "@clerk/clerk-react";
import { transcribe } from "@/utils/utils";

export default function RecordPage() {
  const { recordID } = useLocalSearchParams();
  const router = useRouter();
  const [showMarkdown, setShowMarkdown] = useState(true);
  const { getToken } = useAuth();
  const [gettingText, setGettingText] = useState(false);

  const record = useRecord(Number(recordID));

  useEffect(() => {
    console.log("effect function");
    if (record && !record.textUri && record.audioUri && !gettingText) {
      setGettingText(true);
      console.log("fetching text from audio");
      try {
        transcribe(record, getToken());
      } catch (error) {
        setGettingText(false);
      }
    }
  }, [record]);

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Record not found</Text>
        <Link href="../" asChild>
          <TouchableOpacity>
            <Text>Back</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  const handleGoBack = () => {
    if (record.collectionId) {
      router.push(`/collections/${record.collectionId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#FDE047" />
      <View className="bg-yellow-300 rounded-b-3xl">
        <View className="flex-row items-center p-4">
          <Pressable onPress={handleGoBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-black text-3xl font-bold">
            {record.name}
          </Text>
        </View>
      </View>

      <ScrollView className="p-4 flex-1">
        {/* Audio Player */}
        <AudioPlayer audioUri={record.audioUri} />

        {/* Content Toggle */}
        <View className="flex-row justify-between items-center mb-4 bg-gray-100 p-3 rounded-t-lg">
          <Text className="text-lg font-bold">
            {showMarkdown ? "Notes" : "Transcription"}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-2 text-gray-600">Transcription</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FDE047" }}
              thumbColor={showMarkdown ? "#F59E0B" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setShowMarkdown(!showMarkdown)}
              value={showMarkdown}
            />
            <Text className="ml-2 text-gray-600">Notes</Text>
          </View>
        </View>

        {/* Content Display */}
        <View className="mb-10">
          {showMarkdown ? (
            <MarkdownBox uri={record.markdownUri!} />
          ) : (
            <TextBox uri={record.textUri!} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
