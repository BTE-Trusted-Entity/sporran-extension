import { FormEvent } from 'react';
import { MemoryRouter } from 'react-router-dom';
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
import { decryptIdentity } from '../../utilities/identities/identities';

import { PasswordField } from './PasswordField';

jest.mock('../../channels/SavedPasswordsChannels/SavedPasswordsChannels');
jest.mock('../../utilities/identities/identities');

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const passwordField = {
  set: jest.fn(),
  setIsEmpty: jest.fn(),
};

describe('PasswordField', () => {
  beforeEach(() => {
    passwordField.set.mockReset();
    passwordField.setIsEmpty.mockReset();
    (decryptIdentity as jest.Mock).mockReset();
    (getPasswordChannel.get as jest.Mock).mockReset();
    (savePasswordChannel.get as jest.Mock).mockReset();
    (forgetPasswordChannel.get as jest.Mock).mockReset();
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
      <MemoryRouter initialEntries={[paths.popup.base]}>
        <form>
          <PasswordField identity={identity} password={passwordField} />
        </form>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
  });

  it('should indicate saved password', async () => {
    const promise = Promise.resolve('password');
    (getPasswordChannel.get as jest.Mock).mockReturnValue(promise);

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

  describe('password getter', () => {
    it('should report an invalid password', async () => {
      (decryptIdentity as jest.Mock).mockRejectedValue(
        new Error('Invalid password'),
      );
      let error = '';

      async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const getPassword = passwordField.set.mock.calls.pop()[0]();
        try {
          await getPassword(event);
        } catch (e) {
          error = e.message;
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
      userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => password !== '');
      expect(password).toEqual('PASS');
    });

    it('should return the saved password and clear it', async () => {
      const promise = Promise.resolve('PASS');
      (getPasswordChannel.get as jest.Mock).mockReturnValue(promise);

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

      await act(async () => {
        await promise;
      });
      userEvent.click(await screen.findByLabelText(/Remember password/));
      userEvent.click(await screen.findByText('Submit'));

      await waitFor(() => password !== '');
      expect(password).toEqual('PASS');
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
