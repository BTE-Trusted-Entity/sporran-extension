import { useState } from 'react';
import { Meta } from '@storybook/react';

import * as styles from './ErrorTooltip.module.css';

export default {
  title: 'Components/ErrorTooltip',
} as Meta;

export function Template() {
  const [error, setError] = useState('');

  return (
    <form>
      <p style={{ position: 'relative' }}>
        <label>
          Value:
          <input name="foo" onInput={() => setError('Totally incorrect!!11')} />
        </label>

        <output className={styles.tooltip} hidden={!error}>
          {error}
        </output>
      </p>
    </form>
  );
}
