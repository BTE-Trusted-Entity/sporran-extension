import { Meta } from '@storybook/react';
import { Link } from 'react-router-dom';

import { LinkBack } from './LinkBack';

import styles from './LinkBack.module.css';

export default {
  title: 'Components/LinkBack',
} as Meta;

const background = {
  padding: '2rem',
};

export function CSS(): JSX.Element {
  return (
    <section style={background}>
      <Link to="" title="Back" className={styles.linkBack} />
    </section>
  );
}

export function Component(): JSX.Element {
  return (
    <section style={background}>
      <LinkBack />
    </section>
  );
}
