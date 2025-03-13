import { Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { useState, useEffect } from "react";

interface MarkdownBoxProps {
  uri: string;
}

export function MarkdownBox({ uri }: MarkdownBoxProps) {
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
        console.error("Error fetching markdown content:", err);
      }
    };

    fetchContent();
  }, [uri]);

  if (!uri) return null;
  if (error) return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-2">Notes</Text>
      <View className="bg-red-50 p-4 rounded-lg">
        <Text className="text-red-600">Error loading content: {error}</Text>
      </View>
    </View>
  );

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-2">Notes</Text>
      <View className="bg-gray-50 p-4 rounded-lg">
        <Markdown>{content}</Markdown>
      </View>
    </View>
  );
}
