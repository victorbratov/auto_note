import { Pressable, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView } from "react-native";
import Card from "@/components/Card";
import { useCollection, useRecordsByCollection } from "@/db/hooks";
import { NewRecordModal } from "@/components/NewRecordModal";
import { AddButton } from "@/components/addButton";

export default function CollectionPage() {
  const { collectionID } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const collection = useCollection(Number(collectionID));
  const { data } = useRecordsByCollection(Number(collectionID));

  const handleGoBack = () => {
    router.dismissTo("/");
  }

  if (!collection) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Collection not found</Text>
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
          <Text className="text-black text-3xl font-bold mr-4">
            {collection.name}
          </Text>
          {collection.description && (
            <Text className="text-gray-800 mt-2">{collection.description}</Text>
          )}
        </View>
      </View>
      <ScrollView className="p-4 flex-1">
        {data.length === 0 ? (
          <Text className="text-center text-gray-500 dark:text-gray-50 mt-4">
            No records in this collection
          </Text>
        ) : (
          data.map((record) => (
            <Link key={record.id} href={`/records/${record.id}`} asChild>
              <TouchableOpacity>
                <Card title={record.name} className="mb-4">
                  <Text className="text-gray-600 dark:text-gray-100">
                    {record.createdAt || "No content"}
                  </Text>
                </Card>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </ScrollView>
      <AddButton
        onPress={() => {
          setIsModalVisible(true);
        }}
        className="absolute bottom-10 right-10"
      />
      <NewRecordModal
        onClose={() => {
          setIsModalVisible(false);
        }}
        visible={isModalVisible}
        collectionId={Number(collectionID)}
      />
    </View>
  );
}
