import {
  initSavedPasswords,
  savePasswordListener,
  getPasswordListener,
  forgetPasswordListener,
  forgetAllPasswordsListener,
} from './initSavedPasswords';
import {
  MessageType,
  SavePasswordRequest,
  GetPasswordRequest,
  ForgetPasswordRequest,
  ForgetAllPasswordsRequest,
} from '../MessageType';

describe('initSavedPasswords', () => {
  const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

  jest.useFakeTimers();
  initSavedPasswords();

  it('should save the password', async () => {
    savePasswordListener({
      type: MessageType.savePasswordRequest,
      data: {
        address: mockAddress,
        password: 'somePassword',
      },
    } as SavePasswordRequest);

    jest.advanceTimersByTime(1 * 60 * 1000);

    const retrievedPassword = await getPasswordListener({
      type: MessageType.getPasswordRequest,
      data: { address: mockAddress },
    } as GetPasswordRequest);

    expect(retrievedPassword).toBe('somePassword');
  });

  it('should forget the password after 15 minutes', async () => {
    savePasswordListener({
      type: MessageType.savePasswordRequest,
      data: {
        address: mockAddress,
        password: 'somePassword',
      },
    } as SavePasswordRequest);

    jest.spyOn(global.Date, 'now').mockReturnValue(Date.now() + 15 * 60 * 1000);

    jest.advanceTimersByTime(15 * 60 * 1000);

    const retrievedPassword = await getPasswordListener({
      type: MessageType.getPasswordRequest,
      data: { address: mockAddress },
    } as GetPasswordRequest);

    expect(retrievedPassword).toBeUndefined();
  });

  it('should forget the password when requested', async () => {
    savePasswordListener({
      type: MessageType.savePasswordRequest,
      data: {
        address: mockAddress,
        password: 'somePassword',
      },
    } as SavePasswordRequest);

    jest.advanceTimersByTime(1 * 60 * 1000);

    forgetPasswordListener({
      type: MessageType.forgetPasswordRequest,
      data: { address: mockAddress },
    } as ForgetPasswordRequest);

    const retrievedPassword = await getPasswordListener({
      type: MessageType.getPasswordRequest,
      data: { address: mockAddress },
    } as GetPasswordRequest);

    expect(retrievedPassword).toBeUndefined();
  });

  it('should forget all passwords when requested', async () => {
    const mockAddress2 = '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';
    const mockAddress3 = '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL';

    savePasswordListener({
      type: MessageType.savePasswordRequest,
      data: {
        address: mockAddress,
        password: 'somePassword',
      },
    } as SavePasswordRequest);
    savePasswordListener({
      type: MessageType.savePasswordRequest,
      data: {
        address: mockAddress2,
        password: 'somePassword2',
      },
    } as SavePasswordRequest);
    savePasswordListener({
      type: MessageType.savePasswordRequest,
      data: {
        address: mockAddress3,
        password: 'somePassword3',
      },
    } as SavePasswordRequest);

    jest.advanceTimersByTime(1 * 60 * 1000);

    forgetAllPasswordsListener({
      type: MessageType.forgetAllPasswordsRequest,
    } as ForgetAllPasswordsRequest);

    const retrievedPassword = await getPasswordListener({
      type: MessageType.getPasswordRequest,
      data: { address: mockAddress },
    } as GetPasswordRequest);
    const retrievedPassword2 = await getPasswordListener({
      type: MessageType.getPasswordRequest,
      data: { address: mockAddress2 },
    } as GetPasswordRequest);
    const retrievedPassword3 = await getPasswordListener({
      type: MessageType.getPasswordRequest,
      data: { address: mockAddress3 },
    } as GetPasswordRequest);

    expect(retrievedPassword).toBeUndefined();
    expect(retrievedPassword2).toBeUndefined();
    expect(retrievedPassword3).toBeUndefined();
  });
});
