import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';
import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { mockIsFullDid } from '../../utilities/did/did.mock';

import { IdentityOptions } from './IdentityOptions';

const onEdit = jest.fn();

const props = {
  identity: identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
  onEdit,
};

describe('AddIdentity', () => {
  it('should render', async () => {
    const { container } = render(<IdentityOptions {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(<IdentityOptions {...props} />);
    const openMenuButton = await screen.findByLabelText('Identity options');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    expect(container).toMatchSnapshot();
  });

  it('should show full Did option', async () => {
    mockIsFullDid(true);
    const { container } = render(
      <IdentityOptions
        identity={
          identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
        onEdit={onEdit}
      />,
    );
    await userEvent.click(await screen.findByLabelText('Identity options'));

    expect(container).toMatchSnapshot();
  });
});
