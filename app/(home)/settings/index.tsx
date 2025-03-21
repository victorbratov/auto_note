import Card from "@/components/Card";
import { getSetting, setSetting } from "@/settings_store";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { toggleColorScheme } = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [colorScheme, setColorScheme] = useState("light");

  getSetting("colorScheme").then((color) => setColorScheme(color!));

  const changeColorScheme = () => {
    if (colorScheme === "light") {
      setSetting("colorScheme", "dark");
      setColorScheme("dark");
    } else {
      setSetting("colorScheme", "light");
      setColorScheme("light");
    }
    toggleColorScheme();
  };

  const handleGoBack = () => {
    router.dismissTo("/");
  };

  const handleSignOut = () => {
    signOut();
    router.dismissTo("/");
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingRight: insets.right, paddingBottom: insets.bottom, paddingLeft: insets.left }}>
      <View className="flex-1">
        <View className="bg-yellow-300 dark:bg-amber-400 rounded-b-3xl">
          <View className="flex-row justify-start items-center p-4 gap-4">
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-black text-3xl font-bold">SETTINGS</Text>
          </View>
        </View>
        <ScrollView className="p-4 flex-1 gap-4 bg-white dark:bg-gray-900">
          <Card title="Account">
            <View className="flex-1 flex-row justify-start items-center gap-4">
              <Image className="h-16 w-16 rounded-full border-black border-2" source={{ uri: user?.imageUrl }} />
              <Text className="text-gray-800 dark:text-gray-200 text-md">{user?.primaryEmailAddress?.emailAddress}</Text>
            </View>
          </Card>
          <Card>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-800 dark:text-gray-200 text-md">Dark Mode</Text>
              <Switch
                thumbColor={colorScheme === "dark" ? "black" : "white"}
                onChange={changeColorScheme}
                value={colorScheme === "dark"}
                trackColor={{ false: "gray", true: "gray" }}
              />
            </View>
          </Card>
          <Card>
            <TouchableOpacity onPress={handleSignOut} className="bg-red-500 p-4 rounded-md">
              <Text className="text-white text-center font-bold">Sign Out</Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}
