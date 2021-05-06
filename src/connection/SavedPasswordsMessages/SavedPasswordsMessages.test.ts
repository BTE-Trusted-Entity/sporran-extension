import {
  savePasswordListener,
  getPasswordListener,
  forgetPasswordListener,
  forgetAllPasswordsListener,
  hasSavedPasswordsListener,
  schedulePasswordsCheck,
} from './SavedPasswordsMessages';

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
jest.useFakeTimers('modern');
schedulePasswordsCheck();

describe('SavedPasswordsMessages', () => {
  it('should save the password', async () => {
    await savePasswordListener({
      address: mockAddress,
      password: 'somePassword',
    });

    jest.advanceTimersByTime(1 * 60 * 1000);

    const retrievedPassword = await getPasswordListener({
      address: mockAddress,
    });

    expect(retrievedPassword).toBe('somePassword');
  });

  it('should forget the password after 15 minutes', async () => {
    await savePasswordListener({
      address: mockAddress,
      password: 'somePassword',
    });

    jest.advanceTimersByTime(16 * 60 * 1000);

    const retrievedPassword = await getPasswordListener({
      address: mockAddress,
    });

    expect(retrievedPassword).toBeUndefined();
  });

  it('should forget the password when requested', async () => {
    await savePasswordListener({
      address: mockAddress,
      password: 'somePassword',
    });

    jest.advanceTimersByTime(1 * 60 * 1000);

    await forgetPasswordListener({ address: mockAddress });

    const retrievedPassword = await getPasswordListener({
      address: mockAddress,
    });

    expect(retrievedPassword).toBeUndefined();
  });

  it('should forget all passwords when requested', async () => {
    const mockAddress2 = '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';

    await savePasswordListener({
      address: mockAddress,
      password: 'somePassword',
    });
    await savePasswordListener({
      address: mockAddress2,
      password: 'somePassword2',
    });

    jest.advanceTimersByTime(1 * 60 * 1000);

    await forgetAllPasswordsListener();

    const retrievedPassword = await getPasswordListener({
      address: mockAddress,
    });
    const retrievedPassword2 = await getPasswordListener({
      address: mockAddress2,
    });

    expect(retrievedPassword).toBeUndefined();
    expect(retrievedPassword2).toBeUndefined();
  });

  it('should return true if user has any saved passwords', async () => {
    await savePasswordListener({
      address: mockAddress,
      password: 'somePassword',
    });

    const hasPasswords = await hasSavedPasswordsListener();

    expect(hasPasswords).toBe(true);
  });
});
