import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Recorder } from "@/audio/recorder";
import { AudioPlayer } from "@/audio/player";

interface RecordingModalProps {
  visible: boolean;
  onClose: () => void;
  onRecordingCreated: () => void;
}

export function RecordingModal({
  visible,
  onClose,
  onRecordingCreated,
}: RecordingModalProps) {
  const [recordingName, setRecordingName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder] = useState(new Recorder());

  const handleStartRecording = async () => {
    if (!recordingName.trim()) {
      alert("Please enter a recording name");
      return;
    }
    try {
      await recorder.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to start recording");
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await recorder.stopRecording();
      const savedPath = await recorder.saveRecording(uri, recordingName);
      setIsRecording(false);
      onRecordingCreated();
      onClose();
      setRecordingName("");
    } catch (error) {
      console.error("Failed to stop recording:", error);
      alert("Failed to stop recording");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-4/5">
          <Text className="text-xl font-bold mb-4">New Recording</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded mb-4"
            placeholder="Enter recording name"
            value={recordingName}
            onChangeText={setRecordingName}
            editable={!isRecording}
          />
          {!isRecording ? (
            <TouchableOpacity
              onPress={handleStartRecording}
              className="bg-blue-500 p-3 rounded-lg mb-2"
            >
              <Text className="text-white text-center">Start Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleStopRecording}
              className="bg-red-500 p-3 rounded-lg mb-2"
            >
              <Text className="text-white text-center">Stop Recording</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-300 p-3 rounded-lg"
          >
            <Text className="text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
