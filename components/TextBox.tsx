import { Text, View } from "react-native";
import { useState, useEffect } from "react";

interface TextBoxProps {
  uri: string;
}

export function TextBox({ uri }: TextBoxProps) {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!uri) return;

    const fetchContent = async () => {
      try {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
        console.error("Error fetching text content:", err);
      }
    };

    fetchContent();
  }, [uri]);

  if (!uri) return null;
  if (error)
    return (
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">Transcription</Text>
        <View className="bg-red-50 p-4 rounded-lg">
          <Text className="text-red-600">Error loading content: {error}</Text>
        </View>
      </View>
    );

  return (
    <View className="bg-gray-100 p-4 rounded-lg">
      <Text>{content}</Text>
    </View>
  );
}
