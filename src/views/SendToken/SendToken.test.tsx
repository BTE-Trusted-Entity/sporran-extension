import BN from 'bn.js';
import userEvent from '@testing-library/user-event';

import { NEW } from '../../utilities/accounts/accounts';
import {
  accountsMock as accounts,
  render,
  runWithJSDOMErrorsDisabled,
  screen,
} from '../../testing/testing';
import { waitForNextTartan } from '../../utilities/accounts/getNextTartan.mock';
import { mockFeeChannel } from '../../channels/feeChannel/feeChannel.mock';
import '../../components/usePasteButton/usePasteButton.mock';

import { SendToken } from './SendToken';

mockFeeChannel();

jest.mock(
  '../../channels/existentialDepositChannel/existentialDepositChannel',
  () => ({
    existentialDepositChannel: {
      async get() {
        return new BN('100000000000000');
      },
    },
  }),
);

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('SendToken', () => {
  it('should render', async () => {
    const { container } = render(
      <SendToken account={account} onSuccess={jest.fn()} />,
    );
    await screen.findByText(/Maximum sendable amount: 1.1260/);
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
    await screen.findByText(/Maximum sendable amount: 1.1260/);

    await runWithJSDOMErrorsDisabled(() => {
      userEvent.click(submit);
    });

    expect(onSuccess).toHaveBeenCalled();
    const values = onSuccess.mock.calls[0][0];
    expect(values.recipient).toEqual(address);
    expect(values.amount.toString()).toEqual('1000000000000000');
    expect(values.fee.toString()).toEqual('100000000000000');
    expect(values.tip.toString()).toEqual('10000000000000');
  });

  it('should warn if balance will go below existential deposit', async () => {
    const recipientAddress = '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL';
    const onSuccess = jest.fn();

    render(<SendToken account={account} onSuccess={onSuccess} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '1.1');
    userEvent.type(
      await screen.findByLabelText('Paste the recipient address here'),
      recipientAddress,
    );

    const submit = await screen.findByRole('button', {
      name: 'Review & Sign Transaction',
    });
    await runWithJSDOMErrorsDisabled(() => {
      userEvent.click(submit);
    });

    expect(onSuccess).toHaveBeenCalled();

    const values = onSuccess.mock.calls[0][0];

    expect(values.existentialWarning).toBe(true);
    expect(values.tip.toString()).toEqual('29000000000000');
  });

  it('should report too small an amount', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);

    userEvent.type(await screen.findByLabelText('Amount to send'), '0');

    expect(
      await screen.findByText('The minimum sendable amount is 0.0100'),
    ).toBeInTheDocument();
  });

  it('should report exponentially small amount', async () => {
    render(<SendToken account={account} onSuccess={jest.fn()} />);
    userEvent.type(
      await screen.findByLabelText('Amount to send'),
      '0.0000000000001',
    );
    expect(
      await screen.findByText('The minimum sendable amount is 0.0100'),
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
    userEvent.type(await screen.findByLabelText('Amount to send'), '1.12');

    expect(
      await screen.findByText(
        'The amount+costs exceed your maximum sendable amount',
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
