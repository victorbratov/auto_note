import {
  Audio,
  type AVPlaybackStatus,
  type AVPlaybackStatusSuccess,
} from "expo-av";

type PlaybackStatus = "playing" | "paused";
type PlaybackStatusListener = (status: PlaybackStatus) => void;

export class AudioPlayer {
  private sound: Audio.Sound | null = null;
  private _volume: number = 1.0;
  private _statusListener?: PlaybackStatusListener;

  setStatusListener(listener: PlaybackStatusListener) {
    this._statusListener = listener;
  }

  async loadAudio(uri: string): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { volume: this._volume },
        (status) => {
          if (!status.isLoaded) return;

          if (status.didJustFinish) {
            console.log("Adio finished", this._statusListener);
            sound.setPositionAsync(0);
            this._statusListener?.("paused");
          }
        },
      );
      this.sound = sound;
    } catch (error) {
      console.error("Error loading audio:", error);
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      if (!this.sound) {
        throw new Error("No audio loaded");
      }
      await this.sound.playAsync();
      this._statusListener?.("playing");
    } catch (error) {
      console.error("Error playing audio:", error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    try {
      if (!this.sound) {
        throw new Error("No audio loaded");
      }
      await this.sound.pauseAsync();
      this._statusListener?.("paused");
    } catch (error) {
      console.error("Error pausing audio:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.sound) {
        throw new Error("No audio loaded");
      }
      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
      this._statusListener?.("paused");
    } catch (error) {
      console.error("Error stopping audio:", error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      if (volume < 0 || volume > 1) {
        throw new Error("Volume must be between 0 and 1");
      }
      this._volume = volume;
      if (this.sound) {
        await this.sound.setVolumeAsync(volume);
      }
    } catch (error) {
      console.error("Error setting volume:", error);
      throw error;
    }
  }

  async getProgress(): Promise<{ position: number; duration: number }> {
    try {
      if (!this.sound) {
        throw new Error("No audio loaded");
      }
      const status = await this.sound.getStatusAsync() as AVPlaybackStatusSuccess;
      return {
        position: status.positionMillis,
        duration: status.durationMillis || 0,
      };
    } catch (error) {
      console.error("Error getting progress:", error);
      throw error;
    }
  }
  
  async seekTo(position: number): Promise<void> {
    try {
      if (!this.sound) {
        throw new Error("No audio loaded");
      }
      await this.sound.setPositionAsync(position);
    } catch (error) {
      console.error("Error seeking:", error);
      throw error;
    }
  }
  async cleanup(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error("Error cleaning up audio:", error);
      throw error;
    }
  }
}
