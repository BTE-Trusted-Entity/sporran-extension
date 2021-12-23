import { Meta } from '@storybook/react';
import { Link } from 'react-router-dom';

import * as styles from './LinkBack.module.css';

import { LinkBack } from './LinkBack';

export default {
  title: 'Components/LinkBack',
} as Meta;

export function CSS(): JSX.Element {
  return <Link to="" title="Back" className={styles.linkBack} />;
}

export function Component(): JSX.Element {
  return <LinkBack />;
}
