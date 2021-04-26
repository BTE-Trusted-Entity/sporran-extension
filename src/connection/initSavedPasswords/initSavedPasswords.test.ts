import {
  initSavedPasswords,
  savePasswordListener,
  savedPasswords,
  getPasswordListener,
  forgetPasswordListener,
  forgetAllPasswordsListener,
  checkExpiredPasswords,
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

  describe('savePasswordListener', () => {
    it('should save the password and forget it after 15 minutes', () => {
      savePasswordListener({
        type: MessageType.savePasswordRequest,
        data: {
          address: mockAddress,
          password: 'somePassword',
        },
      } as SavePasswordRequest);
      expect(savedPasswords[mockAddress].password).toBe('somePassword');
      expect(savedPasswords[mockAddress].timestamp).toBeLessThanOrEqual(
        Date.now(),
      );
    });
    it('should forget password after 15 minutes', () => {
      jest.useFakeTimers();

      initSavedPasswords();

      jest.advanceTimersByTime(15 * 60 * 1000);

      expect(checkExpiredPasswords).toHaveBeenCalledTimes(15);
      expect(savedPasswords).toEqual({});
    });
  });

  describe('getPasswordListener', () => {
    it('should get the saved password', async () => {
      const retrievedPassword = await getPasswordListener({
        type: MessageType.getPasswordRequest,
        data: { address: mockAddress },
      } as GetPasswordRequest);
      expect(retrievedPassword).toBe('somePassword');
    });
  });

  describe('forgetPasswordListener', () => {
    it('should forget the saved password', () => {
      forgetPasswordListener({
        type: MessageType.forgetPasswordRequest,
        data: { address: mockAddress },
      } as ForgetPasswordRequest);
      expect(savedPasswords).toEqual({});
    });
  });

  describe('forgetAllPasswordsListener', () => {
    const mockAddress2 = '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';
    const mockAddress3 = '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL';
    it('should forget all passwords', () => {
      savePasswordListener({
        type: MessageType.savePasswordRequest,
        data: {
          address: mockAddress,
          password: 'somePassword1',
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

      expect(Object.values(savedPasswords).length).toBe(3);

      forgetAllPasswordsListener({
        type: MessageType.forgetAllPasswordsRequest,
      } as ForgetAllPasswordsRequest);

      expect(savedPasswords).toEqual({});
    });
  });
});
