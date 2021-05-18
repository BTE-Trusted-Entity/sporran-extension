import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';
import { AuthorizeDApp } from './AuthorizeDApp';

export default {
  title: 'Views/AuthorizeDApp',
  component: AuthorizeDApp,
} as Meta;

const query =
  'name=KILT-Sporran&origin=https%3A%2F%2Fpolkadot.js.org%2Fapps%2F';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.authorize}?${query}`]}>
      <AuthorizeDApp />
    </MemoryRouter>
  );
}
