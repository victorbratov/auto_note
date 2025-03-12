import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { createCollection } from "@/db/hooks";
interface NewCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewCollectionModal({
  visible,
  onClose,
  onSuccess,
}: NewCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      createCollection({ name, description });
      setName("");
      setDescription("");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create collection:", error);
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
          <Text className="text-xl font-bold mb-4">New Collection</Text>

          <View className="mb-4">
            <Text className="text-sm mb-1">Name</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2"
              value={name}
              onChangeText={setName}
              placeholder="Collection name"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm mb-1">Description</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2"
              value={description}
              onChangeText={setDescription}
              placeholder="Collection description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View className="flex-row justify-end space-x-2">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 rounded-md bg-gray-200"
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="px-4 py-2 rounded-md bg-blue-500"
              disabled={!name.trim()}
            >
              <Text className="text-white">Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
