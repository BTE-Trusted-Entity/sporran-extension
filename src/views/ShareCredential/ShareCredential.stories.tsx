import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

export default {
  title: 'Views/ShareCredential',
  component: ShareCredential,
} as Meta;

const query =
  'cTypeHashes=["0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2"]';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.share}?${query}`]}>
      <ShareCredential />
    </MemoryRouter>
  );
}
