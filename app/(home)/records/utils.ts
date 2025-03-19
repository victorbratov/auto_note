import * as FileSystem from "expo-file-system";
import { Record } from "@/db/schema";
import { updateRecord } from "@/db/quieries";



export const transcribe = (record: Record, token: Promise<string | null>) => {
  FileSystem.getInfoAsync(record.audioUri!)
    .then(async (fileInfo) => {
      if (!fileInfo.exists) {
        console.error("File does not exist:", record.audioUri);
        return;
      }

      console.log("File exists, uploading...");

      // Use FileSystem.uploadAsync for uploading the file
      const url = "http://localhost:8080/transcribe";  // Your upload endpoint
      const fieldName = "uploadfile";  // The field name expected by the server
      const mimeType = "audio/m4a";  // MIME type of the file

      try {
        const response = await FileSystem.uploadAsync(url, record.audioUri!, {
          httpMethod: "POST",  // POST method
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,  // Multipart upload
          fieldName: fieldName,  // The field name in the form-data
          mimeType: mimeType, // The MIME type of the file
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status !== 200) {
          throw new Error(`Failed to upload file: ${response.status}`);
        }
        // Handle the response
        const responseData = response.body;
        const transctipt = JSON.parse(responseData).transcript;
        const textUri = record.audioUri?.replace(".m4a", ".txt");
        FileSystem.writeAsStringAsync(textUri!, transctipt);
        updateRecord(record.id, { textUri: textUri });
        console.log("File uploaded successfully:", responseData);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    })
    .catch(error => {
      console.error("Error getting file info:", error);
    });

};
