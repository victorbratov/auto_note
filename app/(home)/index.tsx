import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import Card from "@/components/Card";
import { AddButton } from "@/components/addButton";
import { NewCollectionModal } from "@/components/NewCollectionModal";
import { useCollections } from "@/db/hooks";

export default function Page() {
  const { user, isLoaded } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const userAvatarUrl = user?.hasImage
    ? user?.imageUrl
    : "../../assets/images/react-logo.png";

  const insets = useSafeAreaInsets();

  const { data } = useCollections();

  const goToSettings = () => {
    router.push("/settings");
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900" style={{ paddingRight: insets.right, paddingBottom: insets.bottom, paddingLeft: insets.left }}>
      <SignedIn>
        <View className="flex-1">
          <View className="bg-yellow-300 dark:bg-amber-400 rounded-b-3xl">
            <View className="flex-row justify-between items-center p-4">
              <Text className="text-black text-3xl font-bold">LIBRARY</Text>
              <TouchableOpacity onPress={goToSettings}>
                <Image
                  source={{ uri: userAvatarUrl }}
                  className="h-16 w-16 rounded-full border-black border-2"
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView className="p-4 flex-1 gap-4 bg-white dark:bg-gray-900">
            {data.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                asChild
              >
                <TouchableOpacity>
                  <Card title={collection.name} className="mb-4">
                    <Text className="text-gray-600 dark:text-gray-200">
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
        </View>
      </SignedIn>
      <SignedOut>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="mb-4">Please sign in</Text>
          <Link href="../sign-in" className="bg-yellow-300 p-2 rounded">
            <Text className="text-black">Go to Sign In</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
