import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MarkdownBox } from "@/components/MarkdownBox";
import { TextBox } from "@/components/TextBox";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useRecord } from "@/db/hooks";
import { updateRecord } from "@/db/quieries";
import * as FileSystem from 'expo-file-system';

export default function RecordPage() {
  const { recordID } = useLocalSearchParams();
  const router = useRouter();
  const [showMarkdown, setShowMarkdown] = useState(true);

  const record = useRecord(Number(recordID));


  useEffect(() => {
    console.log("effect function");
    if (record && !record.textUri && record.audioUri) {
      console.log("fetching text from audio");

      FileSystem.getInfoAsync(record.audioUri)
        .then(async (fileInfo) => {
          if (!fileInfo.exists) {
            console.error("File does not exist:", record.audioUri);
            return;
          }

          console.log("File exists, uploading...");

          // Use FileSystem.uploadAsync for uploading the file
          const url = "http://localhost:8080/upload";  // Your upload endpoint
          const fieldName = "uploadfile";  // The field name expected by the server
          const mimeType = "audio/m4a";  // MIME type of the file

          try {
            const response = await FileSystem.uploadAsync(url, record.audioUri!, {
              httpMethod: "POST",  // POST method
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,  // Multipart upload
              fieldName: fieldName,  // The field name in the form-data
              mimeType: mimeType,  // The MIME type of the file
            });

            // Handle the response
            const responseData = response.body;
            const transctipt = JSON.parse(responseData).transcript;
            const textUri = record.audioUri?.replace(".m4a", ".txt");
            FileSystem.writeAsStringAsync(textUri!, transctipt);
            updateRecord(record.id, { textUri: textUri });
            console.log("File uploaded successfully:", responseData);
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        })
        .catch(error => {
          console.error("Error getting file info:", error);
        });
    }
  }, [record]);

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Record not found</Text>
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
          {showMarkdown && record.markdownUri ? (
            <MarkdownBox uri={record.markdownUri} />
          ) : (
            <TextBox uri={record.textUri!} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
