import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { jsonToBase64 } from '../../utilities/popups/usePopupData';

import { paths } from '../paths';
import { AuthorizeDApp } from './AuthorizeDApp';

export default {
  title: 'Views/AuthorizeDApp',
  component: AuthorizeDApp,
} as Meta;

const mockAccessData = {
  name: 'KILT-Sporran',
  origin: 'https://polkadot.js.org/apps/',
};

const encodedData = jsonToBase64(mockAccessData);

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[`${paths.popup.authorize}?data=${encodedData}`]}
    >
      <AuthorizeDApp />
    </MemoryRouter>
  );
}
