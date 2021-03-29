import { Meta, Story } from '@storybook/react';

import { Settings, Props as SettingsProps } from './Settings';

export default {
  title: 'Components/Settings',
  component: Settings,
} as Meta;

const Template: Story<SettingsProps> = (args) => <Settings {...args} />;

export const noAccounts = Template.bind({});

export const withAccounts = Template.bind({});

withAccounts.args = {
  accounts: {
    '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
      name: 'My Sporran Account',
      address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      index: 1,
    },
    '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
      name: 'My Second Account',
      address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
      index: 2,
    },
    '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
      name: 'My Third Account',
      address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
      index: 3,
    },
  },
};
