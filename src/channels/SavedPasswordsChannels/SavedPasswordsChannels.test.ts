import {
  savePassword,
  getPassword,
  forgetPassword,
  forgetAllPasswords,
  hasSavedPasswords,
  schedulePasswordsCheck,
} from './SavedPasswordsChannels';

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
jest.useFakeTimers();
schedulePasswordsCheck();

describe('SavedPasswordsChannels', () => {
  it('should save the password', async () => {
    await savePassword({
      address: mockAddress,
      password: 'somePassword',
    });

    jest.advanceTimersByTime(1 * 60 * 1000);

    const retrievedPassword = await getPassword(mockAddress);

    expect(retrievedPassword).toBe('somePassword');
  });

  it('should forget the password after 15 minutes', async () => {
    await savePassword({
      address: mockAddress,
      password: 'somePassword',
    });

    jest.advanceTimersByTime(16 * 60 * 1000);

    const retrievedPassword = await getPassword(mockAddress);

    expect(retrievedPassword).toBeUndefined();
  });

  it('should forget the password when requested', async () => {
    await savePassword({
      address: mockAddress,
      password: 'somePassword',
    });

    jest.advanceTimersByTime(1 * 60 * 1000);

    await forgetPassword(mockAddress);

    const retrievedPassword = await getPassword(mockAddress);

    expect(retrievedPassword).toBeUndefined();
  });

  it('should forget all passwords when requested', async () => {
    const mockAddress2 = '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';

    await savePassword({
      address: mockAddress,
      password: 'somePassword',
    });
    await savePassword({
      address: mockAddress2,
      password: 'somePassword2',
    });

    jest.advanceTimersByTime(1 * 60 * 1000);

    await forgetAllPasswords();

    const retrievedPassword = await getPassword(mockAddress);
    const retrievedPassword2 = await getPassword(mockAddress);

    expect(retrievedPassword).toBeUndefined();
    expect(retrievedPassword2).toBeUndefined();
  });

  it('should return true if user has any saved passwords', async () => {
    await savePassword({
      address: mockAddress,
      password: 'somePassword',
    });

    const hasPasswords = await hasSavedPasswords();

    expect(hasPasswords).toBe(true);
  });
});
