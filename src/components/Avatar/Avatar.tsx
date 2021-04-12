import Identicon from '@polkadot/react-identicon';

import { Account } from '../../utilities/accounts/types';
// import styles from './Avatar.module.css';

interface Props {
  account: Account;
}

export function Avatar({ account }: Props): JSX.Element {
  const backgroundStyle = {
    backgroundImage: `url(../images/tartans/${account.tartan}.png)`,
    height: '96px',
    width: '96px',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    margin: 0,
  };

  return (
    <>
      <div style={backgroundStyle} />
      <Identicon value={account.address} size={65} theme="polkadot" />
    </>
  );
}
