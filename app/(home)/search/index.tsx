"use client";
import { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '@/components/Card'; // Adjust the import path as needed
import * as queries from '@/db/quieries'; // Adjust the import path as needed
import { Record } from '@/db/schema'; // Adjust the import path as needed
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

export default function SearchPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(useLocalSearchParams().query as string);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function fetchData() {
      try {
        let data;
        if (!query) {
          data = await queries.getAllRecords();
        } else {
          data = await queries.getRecordsLike(query as string);
        }
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  const onPress = (recordID: number) => {
    router.push(`/records/${recordID}`);
  };

  const handleGoBack = () => {
    router.dismissTo("/");
  };

  return (
    <View
      className="flex-1 bg-white dark:bg-gray-900"
      style={{
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left
      }}
    >
      <View className="flex-1">
        <View className="bg-yellow-300 dark:bg-amber-400 rounded-b-3xl">
          <View className="flex-row justify-start gap-4 items-center p-4">
            <Pressable onPress={handleGoBack} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-black text-3xl font-bold mr-4">
              Search
            </Text>
          </View>
        </View>
        <Card className="flex-[0.05] p-4 rounded-xl">
          <View className="flex-row items-center border border-gray-300 p-3 rounded-xl w-full">
            <TextInput
              className="flex-1 text-gray-800 dark:text-gray-200"
              autoCapitalize="none"
              value={query}
              placeholder="search..."
              placeholderTextColor="#ffffff"
              onChangeText={(text) => setQuery(text)}
            />
            <Pressable
              className="rounded-full"
              onPress={() => setQuery(query)}
            >
              <EvilIcons name="search" size={10} color="white" />
            </Pressable>
          </View>
        </Card>

        <ScrollView className="p-4 flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Text>Loading...</Text>
            </View>
          ) : records.length > 0 ? (
            records.map((record, index) => (
              <Card key={index} title={record.name} className="mb-4" onPress={() => onPress(record.id)}>
                <Text className="text-gray-600 dark:text-gray-100">
                  {record.createdAt || "No content"}
                </Text>
              </Card>
            ))
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text>No records found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
