import { userEvent } from '@testing-library/user-event';
import browser from 'webextension-polyfill';

import {
  identitiesMock as identities,
  render,
  screen,
} from '../../testing/testing';
import { saveIdentity } from '../../utilities/identities/identities';

import { IdentitySlide } from './IdentitySlide';
import { IdentitySlideNew } from './IdentitySlideNew';

jest.mock('../../utilities/identities/identities');
jest.spyOn(browser.runtime, 'sendMessage');

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

describe('IdentitySlide', () => {
  it('should render', async () => {
    const { container } = render(<IdentitySlide identity={identity} />);
    expect(container).toMatchSnapshot();
  });

  it('should enable editing the identity name', async () => {
    const { container } = render(<IdentitySlide identity={identity} options />);

    await userEvent.click(await screen.findByLabelText('Identity options'));
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Edit Identity Name' }),
    );
    await userEvent.type(
      await screen.findByLabelText('Identity name:'),
      ' Foo',
    );

    expect(container).toMatchSnapshot();

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    await userEvent.click(saveButton);

    expect(saveIdentity).toHaveBeenCalledWith({
      name: 'Light DID Identity Foo',
      address: identity.address,
      did: identity.did,
      index: 1,
    });

    expect(
      await screen.findByLabelText('Identity options'),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});

describe('IdentitySlideNew', () => {
  it('should render', async () => {
    const { container } = render(<IdentitySlideNew />);

    expect(container).toMatchSnapshot();
  });
});
