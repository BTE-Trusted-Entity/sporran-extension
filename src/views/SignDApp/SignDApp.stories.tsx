import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';

import { SignDApp } from './SignDApp';

export default {
  title: 'Views/SignDApp',
  component: SignDApp,
} as Meta;

const query =
  'address=4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire&signedExtensions=[]';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.sign}?${query}`]}>
      <SignDApp />
    </MemoryRouter>
  );
}
