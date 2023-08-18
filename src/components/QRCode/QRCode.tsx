import { QRCodeSVG } from 'qrcode.react';

import * as styles from './QRCode.module.css';

interface Props {
  address: string;
  className?: string;
}

export function QRCode({ address, className = styles.component }: Props) {
  return (
    <span className={className}>
      <QRCodeSVG
        value={address}
        level="H"
        fgColor="#8c145a"
        bgColor="#fff"
        includeMargin={false}
        size={128}
      />
      <span className={styles.logo} />
    </span>
  );
}
