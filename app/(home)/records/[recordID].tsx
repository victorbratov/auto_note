import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable, Switch, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MarkdownBox } from "@/components/MarkdownBox";
import { TextBox } from "@/components/TextBox";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useRecord } from "@/db/hooks";
import { useAuth } from "@clerk/clerk-react";
import { transcribe, summarize } from "@/utils/utils";

export default function RecordPage() {
  const { recordID } = useLocalSearchParams();
  const router = useRouter();
  const [showMarkdown, setShowMarkdown] = useState(true);
  const { getToken } = useAuth();
  const [gettingText, setGettingText] = useState(false);
  const [gettingMarkdown, setGettingMarkdown] = useState(false);
  const insets = useSafeAreaInsets();

  const record = useRecord(Number(recordID));

  const handleGoBack = () => {
    router.dismissTo(`/collections/${record.collectionId}`);
  };

  useEffect(() => {
    if (record && !record.textUri && record.audioUri && !gettingText) {
      setGettingText(true);
      console.log("fetching text from audio");
      try {
        transcribe(record, getToken());
      } catch (error) {
        setGettingText(false);
      }
    }
    setGettingText(false);
  }, [record?.audioUri]);

  useEffect(() => {
    if (record && record.textUri && !gettingText && !record.markdownUri && !gettingMarkdown) {
      setGettingMarkdown(true);
      console.log("fetching markdown from text");
      summarize(record, getToken()).then(() => {
        setGettingMarkdown(false);
      });
    }
  }, [record?.textUri]);

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Record not found</Text>
        <Pressable onPress={handleGoBack}>
          <Text>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingRight: insets.right, paddingBottom: insets.bottom, paddingLeft: insets.left }}>
      <View className="bg-yellow-300 dark:bg-amber-400 rounded-b-3xl">
        <View className="flex-row items-center p-4">
          <Pressable onPress={handleGoBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-black text-3xl font-bold">
            {record.name}
          </Text>
        </View>
      </View>

      {/* Audio Player */}
      <AudioPlayer audioUri={record.audioUri} />

      {/* Content Toggle */}
      <View className="flex-row justify-center items-center m-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => setShowMarkdown(false)}
            className={`py-2 px-4 rounded-l-md ${!showMarkdown
              ? "bg-yellow-400 dark:bg-yellow-500"
              : "bg-gray-200 dark:bg-gray-600"
              }`}
          >
            <Text
              className={`${!showMarkdown
                ? "text-gray-800 font-medium"
                : "text-gray-600 dark:text-gray-300"
                }`}
            >
              Transcription
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowMarkdown(true)}
            className={`py-2 px-4 rounded-r-md ${showMarkdown
              ? "bg-yellow-400 dark:bg-yellow-500"
              : "bg-gray-200 dark:bg-gray-600"
              }`}
          >
            <Text
              className={`${showMarkdown
                ? "text-gray-800 font-medium"
                : "text-gray-600 dark:text-gray-300"
                }`}
            >
              Notes
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content Display */}
      <ScrollView className="flex-1 rounded-lg mr-4 ml-4" showsVerticalScrollIndicator={false}>
        <View>
          {showMarkdown ? (
            <MarkdownBox uri={record.markdownUri!} />
          ) : (
            <TextBox uri={record.textUri!} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
