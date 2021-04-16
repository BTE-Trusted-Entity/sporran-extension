import { act } from '@testing-library/react';

import { getNextTartan } from '../utilities/accounts/tartans';

jest.mock('../utilities/accounts/tartans');
const nextTartanPromise = Promise.resolve('MacLeod');
(getNextTartan as jest.Mock).mockReturnValue(nextTartanPromise);

export async function waitForNextTartan(): Promise<void> {
  await act(async () => {
    await nextTartanPromise;
  });
}
