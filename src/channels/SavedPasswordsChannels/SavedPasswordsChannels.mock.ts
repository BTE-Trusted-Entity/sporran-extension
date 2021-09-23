import { act } from '@testing-library/react';

import {
  hasSavedPasswordsChannel,
  getPasswordChannel,
} from './SavedPasswordsChannels';

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

const getPasswordPromise = Promise.resolve(false);
(getPasswordChannel.get as jest.Mock).mockReturnValue(getPasswordPromise);

export async function waitForGetPassword(): Promise<void> {
  await act(async () => {
    await hasSavedPasswordsPromise;
  });
}
