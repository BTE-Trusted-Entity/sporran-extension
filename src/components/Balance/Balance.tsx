import { useEffect, useState } from 'react';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import {
  BalanceChangeResponse,
  BalanceChangeRequest,
  MessageType,
} from '../../connection/MessageType';
import { KiltAmount } from '../KiltAmount/KiltAmount';

interface BalanceProps {
  address: string;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const [balance, setBalance] = useState<BN | null>(null);

  function balanceListener(message: BalanceChangeResponse) {
    setBalance(new BN(message.data.balance, 16));
  }

  useEffect(() => {
    browser.runtime.onMessage.addListener(balanceListener);
    browser.runtime.sendMessage({
      type: MessageType.balanceChangeRequest,
      data: { address },
    } as BalanceChangeRequest);

    return () => {
      browser.runtime.onMessage.removeListener(balanceListener);
    };
  }, [address]);

  return (
    <span>
      {t('component_Balance_label')}

      {balance !== null && <KiltAmount amount={balance} />}

      {balance === null && <ClipLoader size={10} />}
    </span>
  );
}
