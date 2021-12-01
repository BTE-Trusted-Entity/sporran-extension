import { useCallback, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import BN from 'bn.js';

import { Identity } from '../../utilities/identities/types';
import { ReviewTransaction } from '../ReviewTransaction/ReviewTransaction';
import { SendToken } from '../SendToken/SendToken';
import { ExistentialWarning } from '../ExistentialWarning/ExistentialWarning';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function SendTokenFlow({ identity }: Props): JSX.Element {
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | null>(null);
  const [fee, setFee] = useState<BN | null>(null);
  const [tip, setTip] = useState<BN | null>(null);

  const { address } = identity;

  const handleSendTokenSuccess = useCallback(
    (values) => {
      setRecipient(values.recipient);
      setAmount(values.amount);
      setFee(values.fee);
      setTip(values.tip);

      const nextPath = values.existentialWarning
        ? paths.identity.send.warning
        : paths.identity.send.review;
      navigate(generatePath(nextPath, { address }));
    },
    [address, navigate],
  );

  return (
    <Routes>
      <Route
        path={paths.identity.send.warning}
        element={
          <ExistentialWarning
            nextPath={generatePath(paths.identity.send.review, { address })}
          />
        }
      />

      <Route
        path={paths.identity.send.review}
        element={
          recipient && amount && fee && tip ? (
            <ReviewTransaction
              identity={identity}
              recipient={recipient}
              amount={amount}
              fee={fee}
              tip={tip}
            />
          ) : (
            <Navigate
              to={generatePath(paths.identity.send.start, { address })}
            />
          )
        }
      />

      <Route
        path={paths.identity.send.start}
        element={
          <SendToken identity={identity} onSuccess={handleSendTokenSuccess} />
        }
      />
    </Routes>
  );
}
