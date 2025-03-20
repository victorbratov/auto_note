import * as FileSystem from "expo-file-system";
import { Record } from "@/db/schema";
import { updateRecord } from "@/db/quieries";



export const transcribe = (record: Record, token: Promise<string | null>) => {
  FileSystem.getInfoAsync(record.audioUri!)
    .then(async (fileInfo) => {
      if (!fileInfo.exists) {
        console.error("File does not exist:", record.audioUri);
        throw new Error("File does not exist");
      }

      console.log("Audio File exists, uploading...");

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
          headers: { Authorization: `Bearer ${await token}` }
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
        console.log("Audio File uploaded successfully:", responseData);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    })
    .catch(error => {
      console.error("Error getting file info:", error);
      throw error;
    });
};

export const summarize = async (record: Record, token: Promise<string | null>) => {
  const url = "http://localhost:8080/summarize";  // Your summarize endpoint
  try {
    console.log("Summarizing text...");
    const transcript = await FileSystem.readAsStringAsync(record.textUri!);
    const body = JSON.stringify({ text: transcript });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await token}`,
      },
      body: body,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to summarize text: ${response.status}`);
    }

    const responseData = await response.json();
    const markdownUri = record.textUri?.replace(".txt", ".md");

    await FileSystem.writeAsStringAsync(markdownUri!, responseData.summary);
    updateRecord(record.id, { markdownUri: markdownUri });
    console.log("Summary written successfully");
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
};
