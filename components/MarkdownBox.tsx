import { useColorScheme } from "nativewind";
import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
//@ts-ignore
import MathView from "react-native-math-view";

const MarkdownIt = require("markdown-it");
const mathjax = require("markdown-it-mathjax3");
const MarkdownInstance = MarkdownIt().use(mathjax);

type MarkdownBoxProps = {
  uri: string;
};

var LatexCount = 0;

const renderLatex = (latex: string, color: string) => {
  try {
    // Clean the LaTeX string if needed
    const cleanLatex = latex.trim();

    return (
      <MathView
        key={LatexCount++}
        math={cleanLatex}
        style={{ alignSelf: "center", color: color }}
        resizeMode="contain"
        onError={(error: any) =>
          console.error("LaTeX rendering error:", error)
        }
      />
    );
  } catch (err) {
    console.error("Error rendering LaTeX:", err);
    return <Text style={{ color: "red" }}>Error rendering math: {latex}</Text>;
  }
};

export const MarkdownBox: React.FC<MarkdownBoxProps> = ({ uri }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(uri);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`,
          );
        }

        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error("Error fetching markdown content:", err);
      } finally {
        setLoading(false);
      }
    };

    if (uri) {
      fetchContent();
    }
  }, [uri]);

  if (loading) {
    return (
      <View className="bg-white dark:bg-gray-700 rounded-lg" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-white dark:bg-gray-700 rounded-lg" style={{ padding: 10 }}>
        <Text style={{ color: "red" }}>Error loading content: {error}</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View className="bg-white dark:bg-gray-700 rounded-lg" style={{ padding: 10 }}>
        <Text>No content available to display</Text>
      </View>
    );
  }

  // Define custom rules for rendering math content
  const rules = {
    math_inline: (node: any) => {
      return renderLatex(node.content, colorScheme === "dark" ? "white" : "black");
    },
    math_block: (node: any) => {
      return renderLatex(node.content, colorScheme === "dark" ? "white" : "black");
    },
  };

  return (
    <ScrollView className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <Markdown
        style={{ body: { color: colorScheme === "dark" ? "white" : "black" } }}
        rules={rules} markdownit={MarkdownInstance}>
        {content}
      </Markdown>
    </ScrollView>
  );
};
