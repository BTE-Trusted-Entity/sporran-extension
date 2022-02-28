import { act } from '../../testing/testing';

import { showPresentationInfoStorage } from './showPresentationInfoStorage';

jest.mock('./showPresentationInfoStorage');
jest.mocked(showPresentationInfoStorage).mockResolvedValue(false);

export async function waitForPresentationInfo(): Promise<void> {
  await act(async () => {
    await showPresentationInfoStorage();
  });
}
