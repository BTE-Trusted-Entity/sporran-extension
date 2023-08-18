import { useCallback, useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import BN from 'bn.js';

import { Identity } from '../../utilities/identities/types';
import { ReviewTransaction } from '../ReviewTransaction/ReviewTransaction';
import { SendToken } from '../SendToken/SendToken';
import { ExistentialWarning } from '../ExistentialWarning/ExistentialWarning';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function SendTokenFlow({ identity }: Props) {
  const history = useHistory();

  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | null>(null);
  const [fee, setFee] = useState<BN | null>(null);
  const [tip, setTip] = useState<BN | null>(null);

  const { address } = identity;

  const handleSendTokenSuccess = useCallback(
    (values: {
      recipient: string;
      amount: BN;
      fee: BN;
      tip: BN;
      existentialWarning: boolean;
    }) => {
      setRecipient(values.recipient);
      setAmount(values.amount);
      setFee(values.fee);
      setTip(values.tip);

      const nextPath = values.existentialWarning
        ? paths.identity.send.warning
        : paths.identity.send.review;
      history.push(generatePath(nextPath, { address }));
    },
    [address, history],
  );

  return (
    <Switch>
      <Route path={paths.identity.send.warning}>
        <ExistentialWarning
          nextPath={generatePath(paths.identity.send.review, { address })}
        />
      </Route>

      <Route path={paths.identity.send.review}>
        {recipient && amount && fee && tip ? (
          <ReviewTransaction
            identity={identity}
            recipient={recipient}
            amount={amount}
            fee={fee}
            tip={tip}
          />
        ) : (
          <Redirect to={generatePath(paths.identity.send.start, { address })} />
        )}
      </Route>

      <Route path={paths.identity.send.start}>
        <SendToken identity={identity} onSuccess={handleSendTokenSuccess} />
      </Route>
    </Switch>
  );
}
