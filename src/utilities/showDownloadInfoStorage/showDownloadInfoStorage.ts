import useSWR from 'swr';

import { storage } from '../storage/storage';

const key = 'showDownloadInfo';

export async function getShowDownloadInfo(): Promise<boolean> {
  return (await storage.get(key))[key];
}

export async function setShowDownloadInfo(value: boolean): Promise<void> {
  await storage.set({ [key]: value });
}

export function useShowDownloadInfo(): boolean {
  return useSWR('showDownloadInfo', getShowDownloadInfo).data !== false;
}
