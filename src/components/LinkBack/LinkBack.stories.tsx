import { Meta } from '@storybook/react';
import { Link, MemoryRouter, Route } from 'react-router-dom';

import * as styles from './LinkBack.module.css';

import { generatePath, paths } from '../../views/paths';

import { LinkBack } from './LinkBack';

export default {
  title: 'Components/LinkBack',
} as Meta;

export function CSS() {
  return <Link to="" title="Back" className={styles.linkBack} />;
}

export function AsButton() {
  return <LinkBack />;
}

export function AsLink() {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.send.start, { address: 'FOO' }),
      ]}
    >
      <Route path={paths.identity.send.start}>
        <LinkBack to={paths.identity.overview} />
      </Route>
    </MemoryRouter>
  );
}
