import { act } from '@testing-library/react';

import { hasSavedPasswords } from '../utilities/passwords/passwords';

jest.mock('../utilities/passwords/passwords');
const hasSavedPasswordsPromise = Promise.resolve(false);
(hasSavedPasswords as jest.Mock).mockReturnValue(hasSavedPasswordsPromise);

export async function waitForHasSavedPasswords(): Promise<void> {
  await act(async () => {
    await hasSavedPasswordsPromise;
  });
}
