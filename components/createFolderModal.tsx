import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as FileSystem from "expo-file-system";

interface CreateFolderOverlayProps {
  visible: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
}

export const CreateFolderOverlay: React.FC<CreateFolderOverlayProps> = ({
  visible,
  onClose,
  onFolderCreated,
}) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");

  const dataFolder = process.env.EXPO_PUBLIC_DATA_FOLDER!;
  const documentsFolder = FileSystem.documentDirectory + dataFolder;

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    // Remove any characters that might cause issues in file system
    const safeFolderName = folderName.trim().replace(/[/\\?%*:|"<>]/g, "-");

    try {
      const folderPath = `${documentsFolder}/${safeFolderName}`;
      const { exists } = await FileSystem.getInfoAsync(folderPath);

      if (exists) {
        setError("A folder with this name already exists");
        return;
      }

      await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      setFolderName("");
      setError("");
      onFolderCreated();
      onClose();
    } catch (err) {
      console.error("Error creating folder:", err);
      setError("Failed to create folder");
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="w-4/5 bg-white rounded-xl py-6 px-5 shadow-lg">
              <Text className="text-xl font-bold mb-4 text-center text-gray-800">
                Create New Folder
              </Text>

              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-2.5"
                placeholder="Folder name"
                value={folderName}
                onChangeText={setFolderName}
                autoFocus
                maxLength={50}
              />

              {error ? (
                <Text className="text-red-500 mb-2.5 text-sm">{error}</Text>
              ) : null}

              <View className="flex-row justify-between mt-2.5">
                <TouchableOpacity
                  className="bg-gray-200 rounded-lg py-3 px-4 items-center w-[48%]"
                  onPress={onClose}
                >
                  <Text className="text-base font-semibold text-gray-800">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-yellow-300 rounded-lg py-3 px-4 items-center w-[48%]"
                  onPress={handleCreateFolder}
                >
                  <Text className="text-base font-semibold text-black">
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
