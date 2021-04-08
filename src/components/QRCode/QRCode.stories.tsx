import { Meta, Story } from '@storybook/react';
import { CSSProperties } from 'react';

import { QRCode } from './QRCode';

type Type = Story<Parameters<typeof QRCode>[0]>;

const style = { display: 'flex', flexDirection: 'column' } as CSSProperties;

export default {
  title: 'Components/QRCode',
  component: QRCode,
  decorators: [(story) => <div style={style}>{story()}</div>],
} as Meta;

export { QRCode };
(QRCode as Type).args = {
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
};
