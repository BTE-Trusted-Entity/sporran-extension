import {
  accountsMock as accounts,
  render,
  screen,
  waitForTooltipUpdate,
} from '../../testing';
import { SendToken } from './SendToken';
import userEvent from '@testing-library/user-event';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('SendToken', () => {
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
