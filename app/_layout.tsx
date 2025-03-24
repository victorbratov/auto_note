import { tokenCache } from "@/cache";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import "../global.css";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { View, Text } from "react-native";
import { db, expoDb } from "@/db/db";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initializeSettings } from "@/settings_store";
import { restartColor } from "@/utils/utils";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);
  initializeSettings()

  restartColor();



  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }} className="flex-1">
            <Slot screenOptions={{ headerShown: false }} />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
