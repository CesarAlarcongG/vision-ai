import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AnalysisHistoryItem {
  id: string;
  description: string;
  imageUri?: string;
  createdAt: string;
}

const STORAGE_KEY = "analysis_history";

export async function saveAnalysis(description: string, imageUri?: string) {
  const current = await getHistory();

  const item: AnalysisHistoryItem = {
    id: Date.now().toString(),
    description,
    imageUri,
    createdAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...current]));

  return item;
}

export async function getHistory(): Promise<AnalysisHistoryItem[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  return JSON.parse(data);
}

export async function deleteHistoryItem(id: string) {
  const current = await getHistory();

  const filtered = current.filter((item) => item.id !== id);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
