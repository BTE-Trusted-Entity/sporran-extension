import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { storage } from '../storage/storage';

const key = 'showPresentationInfo';

export async function showPresentationInfoStorage(): Promise<boolean> {
  return (await storage.get(key))[key];
}

export async function setShowPresentationInfo(value: boolean): Promise<void> {
  await storage.set({ [key]: value });
}

export function useShowPresentationInfo(): boolean {
  return useAsyncValue(showPresentationInfoStorage, []) !== false;
}
