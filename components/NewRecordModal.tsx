import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Recorder } from "@/audio/recorder";
import { createRecord } from "@/db/hooks";

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

      // Create a new record in the database
      await createRecord({
        name: name.trim(),
        collectionId: collectionId,
        audioUri: uri,
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
