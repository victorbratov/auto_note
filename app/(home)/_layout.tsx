import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Stack } from "expo-router/stack";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {

  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    router.push("/sign-in");
  }


  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{ height: insets.top, width: "100%" }} className="bg-yellow-300 dark:bg-amber-400" />

      <SignedIn>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedIn>
      <SignedOut>
        <Text>SignedOut</Text>
      </SignedOut>
    </>

  );
}
