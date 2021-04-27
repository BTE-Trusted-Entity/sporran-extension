import userEvent from '@testing-library/user-event';

import { NEW } from '../../utilities/accounts/accounts';
import {
  accountsMock as accounts,
  mockBackgroundScript,
  render,
  runWithJSDOMErrorsDisabled,
  screen,
} from '../../testing';
import { waitForNextTartan } from '../../testing/getNextTartan.mock';

import { SendToken } from './SendToken';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('SendToken', () => {
  beforeEach(() => mockBackgroundScript());

  it('should render', async () => {
    const { container } = render(
      <SendToken account={account} onSuccess={jest.fn()} />,
    );
    await screen.findByText(/Maximum sendable amount: 1.2340/);
    expect(container).toMatchSnapshot();
  });

  it('should not render for new account', async () => {
    const { container } = render(
      <SendToken account={NEW} onSuccess={jest.fn()} />,
    );
    await waitForNextTartan();
    expect(container).toMatchSnapshot();
  });

  it('should submit correct values', async () => {
    const address = '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr';
    const onSuccess = jest.fn();
    render(<SendToken account={account} onSuccess={onSuccess} />);

    const submit = await screen.findByRole('button', {
      name: 'Review & Sign Transaction',
    });
    expect(submit).toBeDisabled();

    userEvent.type(await screen.findByLabelText('Amount to send'), '1');
    userEvent.type(
      await screen.findByLabelText('Paste the recipient address here'),
      address,
    );
    userEvent.click(await screen.findByLabelText('Increase the tip by 1%'));
    await screen.findByText(/Maximum sendable amount: 1.2340/);

    await runWithJSDOMErrorsDisabled(() => {
      userEvent.click(submit);
    });

    expect(onSuccess).toHaveBeenCalled();
    const values = onSuccess.mock.calls[0][0];
    expect(values.recipient).toEqual(address);
    expect(values.amount.toString()).toEqual('1000000000000000');
    expect(values.fee.toString()).toEqual('125000000');
    expect(values.tip.toString()).toEqual('10000000000000');
  });

  it('should report too small an amount', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '0');

    expect(
      await screen.findByText('The minimum sendable amount is $minimum$'),
    ).toBeInTheDocument();
  });

  it('should report too large an amount', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '111');

    expect(
      await screen.findByText(
        'The amount entered exceeds your maximum sendable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should report the too large fee', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.click(await screen.findByLabelText('Increase the tip by 1%'));
    userEvent.type(await screen.findByLabelText('Amount to send'), '1.23');

    expect(
      await screen.findByText(
        'The amount+fee exceed your maximum sendable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should not throw for values larger than 1e22 femtokoins', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '1111111');

    expect(
      await screen.findByText(
        'The amount entered exceeds your maximum sendable amount',
      ),
    ).toBeInTheDocument();
  });

  it('should report an invalid amount', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), ',.,.,.');

    expect(
      await screen.findByText('The value entered is not a number'),
    ).toBeInTheDocument();
  });

  it('should report an invalid recipient', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

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

  it('should report the same recipient', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.type(
      await screen.findByLabelText('Paste the recipient address here'),
      account.address,
    );

    expect(
      await screen.findByText(
        'The recipient address is the same as account address',
      ),
    ).toBeInTheDocument();
  });
});
