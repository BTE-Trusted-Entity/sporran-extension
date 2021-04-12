import { Story, Meta } from '@storybook/react';

import { Avatar } from './Avatar';

type Type = Story<Parameters<typeof Avatar>[0]>;

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as Meta;

export { Avatar };
(Avatar as Type).args = {
  account: {
    address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
    name: 'MacIntyre',
    tartan: 'MacIntyre',
    index: 1,
  },
};
