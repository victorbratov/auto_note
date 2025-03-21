import * as SettingsStore from 'expo-secure-store';

export function setSetting(key: string, value: string) {
  return SettingsStore.setItemAsync("settings_" + key, value);
}

export function getSetting(key: string) {
  return SettingsStore.getItemAsync("settings_" + key);
}

export async function initializeSettings() {
  if (await getSetting("colorScheme") == null) {
    setSetting("colorScheme", "light");
  }
}
