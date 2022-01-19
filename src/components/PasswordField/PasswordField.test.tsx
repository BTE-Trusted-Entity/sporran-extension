import { FormEvent } from 'react';
import userEvent from '@testing-library/user-event';

import {
  identitiesMock as identities,
  act,
  render,
  screen,
  waitFor,
} from '../../testing/testing';
import { paths } from '../../views/paths';
import {
  forgetPasswordChannel,
  getPasswordChannel,
  savePasswordChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { decryptIdentity } from '../../utilities/identities/identities';
import { exceptionToError } from '../../utilities/exceptionToError/exceptionToError';

import { PasswordField } from './PasswordField';

jest.mock('../../channels/SavedPasswordsChannels/SavedPasswordsChannels');
jest.mock('../../utilities/identities/identities');

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const passwordField = {
  set: jest.fn(),
  setIsEmpty: jest.fn(),
};

jest.useFakeTimers();

describe('PasswordField', () => {
  beforeEach(() => {
    passwordField.set.mockReset();
    passwordField.setIsEmpty.mockReset();
    jest.mocked(decryptIdentity).mockReset();
    jest.mocked(getPasswordChannel.get).mockReset();
    jest.mocked(savePasswordChannel.get).mockReset();
    jest.mocked(forgetPasswordChannel.get).mockReset();
  });

  it('should match the snapshot', async () => {
    const { container } = render(
      <form>
        <PasswordField identity={identity} password={passwordField} />
      </form>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should skip the reset link in popups', async () => {
    render(
      <PopupTestProvider path={paths.popup.base}>
        <form>
          <PasswordField identity={identity} password={passwordField} />
        </form>
      </PopupTestProvider>,
    );

    expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
  });

  it('should indicate saved password', async () => {
    const promise = Promise.resolve('password');
    jest.mocked(getPasswordChannel.get).mockReturnValue(promise);

    render(
      <form>
        <PasswordField identity={identity} password={passwordField} />
      </form>,
    );

    await act(async () => {
      await promise;
    });
    expect(await screen.findByLabelText(/Remember password/)).toBeChecked();
    expect(await screen.findByLabelText(/Sign with password/)).toHaveValue(
      '************',
    );

    expect(passwordField.setIsEmpty).toHaveBeenCalledTimes(2);
    expect(passwordField.setIsEmpty).toHaveBeenCalledWith(false);
  });
  it('should clear the password from state if it has been cleared from background memory', async () => {
    const promise = Promise.resolve('password');
    jest.mocked(getPasswordChannel.get).mockReturnValue(promise);

    render(
      <form>
        <PasswordField identity={identity} password={passwordField} />
      </form>,
    );
    expect(await screen.findByLabelText(/Remember password/)).toBeChecked();
    expect(await screen.findByLabelText(/Sign with password/)).toHaveValue(
      '************',
    );
    jest.advanceTimersByTime(15 * 60 * 1000);

    jest.mocked(getPasswordChannel.get).mockResolvedValue(undefined);

    jest.advanceTimersByTime(1 * 60 * 1000);

    expect(await screen.findByLabelText(/Remember password/)).not.toBeChecked();
    expect(await screen.findByLabelText(/Sign with password/)).toHaveValue('');
  });

  describe('password getter', () => {
    it('should report an invalid password', async () => {
      jest
        .mocked(decryptIdentity)
        .mockRejectedValue(new Error('Invalid password'));
      let error = '';

      async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const getPassword = passwordField.set.mock.calls.pop()[0]();
        try {
          await getPassword(event);
        } catch (exception) {
          error = exceptionToError(exception).message;
        }
      }

      render(
        <form onSubmit={handleSubmit}>
          <PasswordField identity={identity} password={passwordField} />
          <button type="submit">Submit</button>
        </form>,
      );

      userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => error !== '');
      expect(error).toEqual('Invalid password');
    });

    it('should return the valid password', async () => {
      let password: Record<string, string> = {};

      async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const getPassword = passwordField.set.mock.calls.pop()[0]();
        password = await getPassword(event);
      }

      render(
        <form onSubmit={handleSubmit}>
          <PasswordField identity={identity} password={passwordField} />
          <button type="submit">Submit</button>
        </form>,
      );

      userEvent.type(
        await screen.findByLabelText(/Sign with password/),
        'PASS',
      );
      userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => password !== {});
      expect(password.password).toEqual('PASS');
    });

    it('should return the saved password and clear it', async () => {
      const promise = Promise.resolve('PASS');
      jest.mocked(getPasswordChannel.get).mockReturnValue(promise);

      let password: Record<string, string> = {};

      async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const getPassword = passwordField.set.mock.calls.pop()[0]();
        password = await getPassword(event);
      }

      render(
        <form onSubmit={handleSubmit}>
          <PasswordField identity={identity} password={passwordField} />
          <button type="submit">Submit</button>
        </form>,
      );

      await act(async () => {
        await promise;
      });
      userEvent.click(await screen.findByLabelText(/Remember password/));
      userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => password !== {});
      expect(password.password).toEqual('PASS');
      expect(forgetPasswordChannel.get).toHaveBeenCalledWith(identity.address);
    });

    it('should remember the valid password', async () => {
      let password = '';

      async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const getPassword = passwordField.set.mock.calls.pop()[0]();
        password = await getPassword(event);
      }

      render(
        <form onSubmit={handleSubmit}>
          <PasswordField identity={identity} password={passwordField} />
          <button type="submit">Submit</button>
        </form>,
      );

      userEvent.type(
        await screen.findByLabelText(/Sign with password/),
        'PASS',
      );
      userEvent.click(await screen.findByLabelText(/Remember password/));
      userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => password !== '');

      expect(savePasswordChannel.get).toHaveBeenCalledWith({
        address: identity.address,
        password: 'PASS',
      });
    });
  });
});
