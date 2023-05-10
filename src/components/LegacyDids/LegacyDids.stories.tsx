import { Meta } from '@storybook/react';
import { JSX } from 'react';

import {
  IdentitiesProviderMock,
  legacyIdentity,
} from '../../utilities/identities/IdentitiesProvider.mock';

import { LegacyDids } from './LegacyDids';

export default {
  title: 'Components/LegacyDids',
  component: LegacyDids,
} as Meta;

export function Template(): JSX.Element {
  return (
    <IdentitiesProviderMock
      identities={{ [legacyIdentity.address]: legacyIdentity }}
    >
      <LegacyDids />
    </IdentitiesProviderMock>
  );
}
