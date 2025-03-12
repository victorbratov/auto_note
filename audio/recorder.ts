import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Recording } from "expo-av/build/Audio";

export class Recorder {
  private recording: Recording | null = null;
  private isPaused: boolean = false;

  constructor() {
    this.setupAudio();
  }

  private async setupAudio(): Promise<void> {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error("Failed to setup audio:", error);
      throw new Error("Failed to setup audio permissions");
    }
  }

  public async startRecording(): Promise<void> {
    try {
      // Create new recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      this.recording = recording;
      this.isPaused = false;
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw new Error("Failed to start recording");
    }
  }

  public async stopRecording(): Promise<string> {
    if (!this.recording) {
      throw new Error("No active recording");
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isPaused = false;

      if (!uri) {
        throw new Error("Recording URI is null");
      }

      return uri;
    } catch (error) {
      console.error("Failed to stop recording:", error);
      throw new Error("Failed to stop recording");
    }
  }

  public async pauseRecording(): Promise<void> {
    if (!this.recording || this.isPaused) {
      throw new Error("Cannot pause: No active recording or already paused");
    }

    try {
      await this.recording.pauseAsync();
      this.isPaused = true;
    } catch (error) {
      console.error("Failed to pause recording:", error);
      throw new Error("Failed to pause recording");
    }
  }

  public async resumeRecording(): Promise<void> {
    if (!this.recording || !this.isPaused) {
      throw new Error("Cannot resume: No active recording or not paused");
    }

    try {
      await this.recording.startAsync();
      this.isPaused = false;
    } catch (error) {
      console.error("Failed to resume recording:", error);
      throw new Error("Failed to resume recording");
    }
  }

  public async saveRecording(uri: string, filename: string): Promise<string> {
    try {
      const directory = `${FileSystem.documentDirectory}/Data/`;
      const newPath = `${directory}${filename}.m4a`;

      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

      // Move the recording file to the new location
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      return newPath;
    } catch (error) {
      console.error("Failed to save recording:", error);
      throw new Error("Failed to save recording");
    }
  }
}
