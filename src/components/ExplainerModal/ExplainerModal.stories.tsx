import { Meta } from '@storybook/react';
import { JSX, useRef } from 'react';

import * as styles from '../Typography/Typography.module.css';

import { ExplainerModal } from './ExplainerModal';

export default {
  title: 'Components/ExplainerModal',
  component: ExplainerModal,
} as Meta;

export function Template(): JSX.Element {
  const portalRef = useRef<HTMLDivElement>(null);
  return (
    <section>
      <p className={styles.subline}>
        <ExplainerModal label="Click me!" portalRef={portalRef}>
          Wikipedia is an online free-content encyclopedia helping to create a
          world where everyone can freely share and access all available
          knowledge. It is supported by the Wikimedia Foundation and consists of
          freely editable content.
        </ExplainerModal>{' '}
        Deposit + fee
      </p>

      <div ref={portalRef} />
    </section>
  );
}
