import { Meta } from '@storybook/react';
import { Link } from 'react-router-dom';

import styles from './LinkBack.module.css';

export default {
  title: 'Components/LinkBack',
} as Meta;

const background = {
  padding: '2rem',
};

export function LinkBack(): JSX.Element {
  return (
    <section style={background}>
      <Link to="" title="Back" className={styles.linkBack} />
    </section>
  );
}
