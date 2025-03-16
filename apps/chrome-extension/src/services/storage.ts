import { StorageData, Personality } from "../types";

const STORAGE_KEY = "vernisai_data";

export const getStorageData = async (): Promise<StorageData> => {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return result[STORAGE_KEY] || {};
  } catch (error) {
    console.error("Error getting storage data:", error);
    return {};
  }
};

export const setStorageData = async (
  data: Partial<StorageData>,
): Promise<void> => {
  try {
    const currentData = await getStorageData();
    const newData = { ...currentData, ...data };
    await chrome.storage.sync.set({ [STORAGE_KEY]: newData });
  } catch (error) {
    console.error("Error setting storage data:", error);
    throw error;
  }
};

export const getApiKey = async (): Promise<string | undefined> => {
  const data = await getStorageData();
  return data.apiKey;
};

export const setApiKey = async (apiKey: string): Promise<void> => {
  await setStorageData({ apiKey });
};

export const getPreferredPersonality = async (): Promise<
  Personality | undefined
> => {
  const data = await getStorageData();
  return data.preferredPersonality;
};

export const setPreferredPersonality = async (
  personality: Personality,
): Promise<void> => {
  await setStorageData({ preferredPersonality: personality });
};
