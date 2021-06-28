import Code from 'qrcode.react';

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
      <Code
        className={styles.code}
        value={address}
        level="H"
        renderAs="svg"
        fgColor="#8c145a"
      />
      <span className={styles.logo} />
    </span>
  );
}
