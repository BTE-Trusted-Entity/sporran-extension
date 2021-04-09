import { QRCode as Code } from 'react-qr-svg';

import styles from './QRCode.module.css';

interface Props {
  address: string;
  className?: string;
}

export function QRCode({
  address,
  className = styles.component,
}: Props): JSX.Element {
  return (
    <span className={className}>
      <Code value={`did:kilt:${address}`} level="H" cellClassPrefix="QRCode" />
      <span className={styles.logo} />
    </span>
  );
}
