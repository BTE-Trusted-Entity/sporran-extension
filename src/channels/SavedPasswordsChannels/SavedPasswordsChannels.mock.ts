import { act } from '@testing-library/react';

import {
  hasSavedPasswordsChannel,
  getPasswordChannel,
} from './SavedPasswordsChannels';

jest.mock('./SavedPasswordsChannels');

const hasSavedPasswordsPromise = Promise.resolve(false);
jest
  .mocked(hasSavedPasswordsChannel.get)
  .mockReturnValue(hasSavedPasswordsPromise);

export async function waitForHasSavedPasswords(): Promise<void> {
  await act(async () => {
    await hasSavedPasswordsPromise;
  });
}

const getPasswordPromise = Promise.resolve('');
jest.mocked(getPasswordChannel.get).mockReturnValue(getPasswordPromise);

export async function waitForGetPassword(): Promise<void> {
  await act(async () => {
    await hasSavedPasswordsPromise;
  });
}
