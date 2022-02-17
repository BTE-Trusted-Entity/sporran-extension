import { act } from '../../testing/testing';

import { getShowDownloadInfo } from './showDownloadInfoStorage';

jest.mock('./showDownloadInfoStorage');
jest.mocked(getShowDownloadInfo).mockResolvedValue(false);

export async function waitForDownloadInfo(): Promise<void> {
  await act(async () => {
    await getShowDownloadInfo();
  });
}
