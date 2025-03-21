import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {


  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{ height: insets.top, width: "100%" }} className="bg-yellow-300 dark:bg-amber-400" />

      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
