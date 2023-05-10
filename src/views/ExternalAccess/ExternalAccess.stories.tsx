import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { ExternalAccess } from './ExternalAccess';

export default {
  title: 'Views/ExternalAccess',
  component: ExternalAccess,
} as Meta;

export function Template(): JSX.Element {
  return <ExternalAccess />;
}
