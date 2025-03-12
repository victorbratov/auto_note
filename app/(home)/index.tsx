import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import FolderCard from "@/components/folderCard";
import { AddButton } from "@/components/addButton";
import { RecordingModal } from "@/components/createFolderModal";

interface FolderData {
  name: string;
  subfolderCount: number;
  recordingUri?: string;
}

const dataFolder = process.env.EXPO_PUBLIC_DATA_FOLDER!;

if (!dataFolder) {
  throw new Error("Add DATA_FOLDER in your .env");
}
const documentsFolder = FileSystem.documentDirectory + dataFolder;

export default function Page() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [folders, setFolders] = useState<FolderData[]>([]);
  const userAvatarUrl = user?.hasImage
    ? user?.imageUrl
    : require("../../assets/images/react-logo.png");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const { exists } = await FileSystem.getInfoAsync(documentsFolder);
        //if folder Data doesnt exist create it
        if (!exists) {
          console.log("Data folder does not exist, creating it now");
          await FileSystem.makeDirectoryAsync(documentsFolder, {
            intermediates: true,
          });
        }
        // Get list of folders in 'Data/'
        const folderList = await FileSystem.readDirectoryAsync(documentsFolder);
        const folderData: FolderData[] = [];

        for (const folder of folderList) {
          const folderPath = `${documentsFolder}/${folder}`;
          // const subfolders = await FileSystem.readDirectoryAsync(folderPath);
          folderData.push({
            name: folder,
            subfolderCount: 0,
            recordingUri: `${documentsFolder}/${folder}`,
          });
        }

        setFolders(folderData);
      } catch (error) {
        console.error("Error reading folders:", error);
      }
    };

    loadFolders();
  }, [refreshTrigger]);

  const handleFolderCreated = () => {
    // Increment refreshTrigger to reload folders
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FDE047" }}>
      <View className="w-full h-full bg-white">
        <StatusBar style="dark" translucent={false} />
        <SignedIn>
          <View className="flex-row justify-between items-center p-4 bg-yellow-300 rounded-b-3xl">
            <Text className="text-black text-3xl font-bold">LIBRARY</Text>
            <TouchableOpacity onPress={() => signOut()}>
              <Image
                source={{ uri: userAvatarUrl }}
                className="h-16 w-16 rounded-full border-black border-2"
              />
            </TouchableOpacity>
          </View>
          <View className="p-4 bg-white w-full h-full">
            {folders.map((folder, index) => (
              <FolderCard
                key={index}
                name={folder.name}
                count={folder.subfolderCount}
                recordingUri={folder.recordingUri}
              />
            ))}
          </View>
          <AddButton
            onPress={() => {
              setShowCreateFolder(true);
            }}
            className="absolute right-10 bottom-10"
          />
          <RecordingModal
            visible={showCreateFolder}
            onClose={() => {
              setShowCreateFolder(false);
            }}
            onRecordingCreated={handleFolderCreated}
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
      </View>
    </SafeAreaView>
  );
}
