import { FormEvent } from 'react';
import { userEvent } from '@testing-library/user-event';
import { KiltKeyringPair, Utils } from '@kiltprotocol/sdk-js';

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
import { useInterval } from '../../utilities/useInterval/useInterval';

import { PasswordField } from './PasswordField';

jest
  .mocked(Utils.Crypto.makeKeypairFromSeed)
  .mockReturnValue({} as KiltKeyringPair);

jest.mock('../../channels/SavedPasswordsChannels/SavedPasswordsChannels');
jest.mock('../../utilities/identities/identities');

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

const passwordField = {
  set: jest.fn(),
};

jest.mock('../../utilities/useInterval/useInterval');
jest.mocked(useInterval).mockImplementation(() => {
  /* do nothing */
});

describe('PasswordField', () => {
  beforeEach(() => {
    passwordField.set.mockReset();
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
      <PopupTestProvider path={paths.popup.base} data={{}}>
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
  });
  it('should clear the password from state if it has been cleared from background memory', async () => {
    const promise = Promise.resolve('password');
    jest.mocked(getPasswordChannel.get).mockReturnValue(promise);

    render(
      <form>
        <PasswordField identity={identity} password={passwordField} />
      </form>,
    );

    await act(async () => {
      await getPasswordChannel.get('');
    });

    expect(await screen.findByLabelText(/Remember password/)).toBeChecked();
    expect(await screen.findByLabelText(/Sign with password/)).toHaveValue(
      '************',
    );

    jest.mocked(getPasswordChannel.get).mockResolvedValue(undefined);

    const callback = jest.mocked(useInterval).mock.calls.pop()?.[0];
    callback?.();

    await act(async () => {
      await getPasswordChannel.get('');
    });

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

      await userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => error !== '');
      expect(error).toEqual('No password');
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

      await userEvent.type(
        await screen.findByLabelText(/Sign with password/),
        'PASS',
      );
      await userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => Object.entries(password).length);
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
      await userEvent.click(await screen.findByLabelText(/Remember password/));
      await userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => Object.entries(password).length);
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

      await userEvent.type(
        await screen.findByLabelText(/Sign with password/),
        'PASS',
      );
      await userEvent.click(await screen.findByLabelText(/Remember password/));
      await userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => password !== '');

      expect(savePasswordChannel.get).toHaveBeenCalledWith({
        address: identity.address,
        password: 'PASS',
      });
    });
  });
});
