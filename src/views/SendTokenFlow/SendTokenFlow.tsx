import { useCallback, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import BN from 'bn.js';

import { transferChannel } from '../../channels/transferChannel/transferChannel';
import { Account } from '../../utilities/accounts/types';
import { ReviewTransaction } from '../ReviewTransaction/ReviewTransaction';
import { SendToken } from '../SendToken/SendToken';
import { ExistentialWarning } from '../ExistentialWarning/ExistentialWarning';
import { generatePath, paths } from '../paths';

interface Props {
  account: Account;
}

export function SendTokenFlow({ account }: Props): JSX.Element {
  const history = useHistory();

  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | null>(null);
  const [fee, setFee] = useState<BN | null>(null);
  const [tip, setTip] = useState<BN | null>(null);

  const { address } = account;

  const handleSendTokenSuccess = useCallback(
    (values) => {
      setRecipient(values.recipient);
      setAmount(values.amount);
      setFee(values.fee);
      setTip(values.tip);

      const nextPath = values.existentialWarning
        ? paths.account.send.warning
        : paths.account.send.review;
      history.push(generatePath(nextPath, { address }));
    },
    [address, history],
  );

  const handleReviewTransactionSuccess = useCallback(
    async ({ password }) => {
      if (!amount || !tip || !recipient) {
        throw new Error('Missing transaction details');
      }

      await transferChannel.get({
        address,
        recipient,
        amount,
        tip,
        password,
      });
    },
    [address, amount, recipient, tip],
  );

  return (
    <Switch>
      <Route path={paths.account.send.warning}>
        <ExistentialWarning
          path={generatePath(paths.account.send.review, { address })}
        />
      </Route>

      <Route path={paths.account.send.review}>
        {recipient && amount && fee && tip ? (
          <ReviewTransaction
            account={account}
            recipient={recipient}
            amount={amount}
            fee={fee}
            tip={tip}
            onSuccess={handleReviewTransactionSuccess}
          />
        ) : (
          <Redirect to={generatePath(paths.account.send.start, { address })} />
        )}
      </Route>

      <Route path={paths.account.send.start}>
        <SendToken account={account} onSuccess={handleSendTokenSuccess} />
      </Route>
    </Switch>
  );
}
