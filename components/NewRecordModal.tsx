import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { Recorder } from "@/audio/recorder";
import { createRecord } from "@/db/hooks";

async function createMockFiles(recordName: string) {
  // Ensure directories exist
  await FileSystem.makeDirectoryAsync(
    `${FileSystem.documentDirectory}markdown`,
    { intermediates: true },
  );
  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}text`, {
    intermediates: true,
  });

  const timestamp = new Date().toISOString();
  const sanitizedName = recordName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  // Create markdown file
  const mdPath = `${FileSystem.documentDirectory}markdown/${sanitizedName}.md`;
  const mdContent = `# ${recordName}\n\nCreated on: ${timestamp}\n\n## Summary\nThis is an auto-generated markdown file for the record "${recordName}"\n\n## Math Examples\n\nSimple equation: $a+b=c$\n\nQuadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n\nIntegral calculus: $\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$\n\nMaxwell's equations: $\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}$\n\n## Notes\n- First point\n- Second point`;

  // Create text file
  const txtPath = `${FileSystem.documentDirectory}text/${sanitizedName}.txt`;
  const txtContent = `${recordName}\n\nCreated: ${timestamp}\n\nTranscription will appear here.`;

  await FileSystem.writeAsStringAsync(mdPath, mdContent);
  await FileSystem.writeAsStringAsync(txtPath, txtContent);

  return {
    markdownUri: mdPath,
    textUri: txtPath,
  };
}
interface NewRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  collectionId: number;
}

export function NewRecordModal({
  visible,
  onClose,
  onSuccess,
  collectionId,
}: NewRecordModalProps) {
  const [name, setName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder] = useState(() => new Recorder());

  const handleStartRecording = async () => {
    try {
      await recorder.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await recorder.stopRecording();
      setIsRecording(false);

      // Create mock files
      const { markdownUri, textUri } = await createMockFiles(name.trim());

      // Create a new record in the database
      await createRecord({
        name: name.trim(),
        collectionId: collectionId,
        audioUri: uri,
        markdownUri,
        textUri,
      });

      // Reset and close
      setName("");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to stop and save recording:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-[90%] rounded-lg p-4">
          <Text className="text-xl font-bold mb-4">New Record</Text>

          <View className="mb-4">
            <Text className="text-sm mb-1">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2"
              value={name}
              onChangeText={setName}
              placeholder="Record name"
            />
          </View>

          <View className="flex-row justify-center space-x-4 mb-6">
            {!isRecording ? (
              <TouchableOpacity
                onPress={handleStartRecording}
                className="px-6 py-3 rounded-full bg-red-500"
                disabled={!name.trim()}
              >
                <Text className="text-white font-bold">Start Recording</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleStopRecording}
                className="px-6 py-3 rounded-full bg-gray-500"
              >
                <Text className="text-white font-bold">Stop Recording</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
