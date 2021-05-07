import { act } from '@testing-library/react';

import { hasSavedPasswords } from './SavedPasswordsMessages';

jest.mock('./SavedPasswordsMessages');
const hasSavedPasswordsPromise = Promise.resolve(false);
(hasSavedPasswords as jest.Mock).mockReturnValue(hasSavedPasswordsPromise);

export async function waitForHasSavedPasswords(): Promise<void> {
  await act(async () => {
    await hasSavedPasswordsPromise;
  });
}
