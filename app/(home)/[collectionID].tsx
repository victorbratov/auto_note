import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Card from "@/components/Card";
import { Collection, Record } from "@/db/schema";
import { getCollectionById, getRecordsByCollectionId } from "@/db/quieries";

export default function CollectionPage() {
  const { collectionID } = useLocalSearchParams();
  const [collection, setCollection] = useState<Collection>();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionIDnum = Number(collectionID);

  useEffect(() => {
    const loadCollectionAndRecords = async () => {
      try {
        console.log(collectionID);
        const collectionData = await getCollectionById(Number(collectionIDnum));
        setCollection(collectionData);

        const recordsData = await getRecordsByCollectionId(
          Number(collectionID),
        );
        setRecords(recordsData);
      } catch (error) {
        console.error("Error loading collection data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCollectionAndRecords();
  }, [collectionID]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Collection not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#FDE047" />
      <View className="bg-yellow-300 rounded-b-3xl">
        <View className="p-4">
          <Text className="text-black text-3xl font-bold">
            {collection.name}
          </Text>
          {collection.description && (
            <Text className="text-gray-700 mt-2">{collection.description}</Text>
          )}
        </View>
      </View>
      <ScrollView className="p-4 flex-1">
        {records.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            No records in this collection
          </Text>
        ) : (
          records.map((record) => (
            <Card key={record.id} title={record.name} className="mb-4">
              <Text className="text-gray-600">
                {record.audioUri || "No content"}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
