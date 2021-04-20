import userEvent from '@testing-library/user-event';

import {
  accountsMock as accounts,
  mockBackgroundScript,
  render,
  screen,
  waitForTooltipUpdate,
} from '../../testing';

import { SendToken } from './SendToken';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('SendToken', () => {
  beforeEach(() => mockBackgroundScript());

  it('should render', async () => {
    const { container } = render(<SendToken account={account} />);
    expect(container).toMatchSnapshot();

    await waitForTooltipUpdate();
  });

  it('should enable submit for correct amount and recipient', async () => {
    render(<SendToken account={account} />);

    const submit = await screen.findByRole('button', {
      name: 'Review & Sign Transaction',
    });
    expect(submit).toBeDisabled();

    userEvent.type(await screen.findByLabelText('Amount to send'), '1');
    userEvent.type(
      await screen.findByLabelText('Paste the recipient address here'),
      '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
    );
    await screen.findByText(/Maximum sendable amount: 1.2340/);

    expect(submit).not.toBeDisabled();
  });

  it('should report too small an amount', async () => {
    render(<SendToken account={account} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '0');

    expect(
      await screen.findByText('The minimum sendable amount is $minimum$'),
    ).toBeInTheDocument();
  });

  it('should report too large an amount', async () => {
    render(<SendToken account={account} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '111');

    expect(
      await screen.findByText(
        'The amount entered exceeds your maximum sendable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should not throw for values larger than 1e22 femtokoins', async () => {
    render(<SendToken account={account} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '1111111');

    expect(
      await screen.findByText(
        'The amount entered exceeds your maximum sendable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should report an invalid amount', async () => {
    render(<SendToken account={account} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), ',.,.,.');

    expect(
      await screen.findByText('The value entered is not a number'),
    ).toBeInTheDocument();
  });

  it('should report an invalid recipient', async () => {
    render(<SendToken account={account} />);

    userEvent.type(
      await screen.findByLabelText('Paste the recipient address here'),
      'My grampa’s cottage',
    );

    expect(
      await screen.findByText(
        'The recipient address is not properly formatted',
      ),
    ).toBeInTheDocument();
  });
});
