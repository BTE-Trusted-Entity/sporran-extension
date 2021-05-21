import { act } from '@testing-library/react';

import { hasSavedPasswordsChannel } from './SavedPasswordsChannels';

jest.mock('./SavedPasswordsChannels');
const hasSavedPasswordsPromise = Promise.resolve(false);
(hasSavedPasswordsChannel.get as jest.Mock).mockReturnValue(
  hasSavedPasswordsPromise,
);

export async function waitForHasSavedPasswords(): Promise<void> {
  await act(async () => {
    await hasSavedPasswordsPromise;
  });
}
