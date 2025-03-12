import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Card from "@/components/Card";
import { AddButton } from "@/components/addButton";
import { NewCollectionModal } from "@/components/NewCollectionModal";
import { useCollections } from "@/db/hooks";

export default function Page() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userAvatarUrl = user?.hasImage
    ? user?.imageUrl
    : "../../assets/images/react-logo.png";

  const { data } = useCollections();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#FDE047" />
      <SignedIn>
        <View className="bg-yellow-300 rounded-b-3xl">
          <View className="flex-row justify-between items-center p-4">
            <Text className="text-black text-3xl font-bold">LIBRARY</Text>
            <TouchableOpacity onPress={() => signOut()}>
              <Image
                source={{ uri: userAvatarUrl }}
                className="h-16 w-16 rounded-full border-black border-2"
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="p-4 flex-1 gap-4">
          {data.map((collection) => (
            <Link key={collection.id} href={`/${collection.id}`} asChild>
              <TouchableOpacity>
                <Card title={collection.name} className="mb-4">
                  <Text className="text-gray-600">
                    {collection.description || "No description"}
                  </Text>
                </Card>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
        <AddButton
          onPress={() => {
            setIsModalVisible(true);
          }}
          className="absolute bottom-10 right-10"
        />
        <NewCollectionModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
          }}
        />
      </SignedIn>
      <SignedOut>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="mb-4">Please sign in</Text>
          <Link href="../sign-in" className="bg-blue-500 p-2 rounded">
            <Text className="text-white">Go to Sign In</Text>
          </Link>
        </View>
      </SignedOut>
    </SafeAreaView>
  );
}
