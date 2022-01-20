import { storage } from '../storage/storage';

const showDownloadInfoKey = 'showDownloadInfo';

type ShowDownloadInfoType = boolean;

export async function getShowDownloadInfo(): Promise<ShowDownloadInfoType> {
  return (await storage.get(showDownloadInfoKey))[showDownloadInfoKey];
}

export async function setShowDownloadInfo(
  show: ShowDownloadInfoType,
): Promise<void> {
  await storage.set({ [showDownloadInfoKey]: show });
}
