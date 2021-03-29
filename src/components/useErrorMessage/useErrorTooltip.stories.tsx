import { useState } from 'react';
import { Meta } from '@storybook/react';

import { useErrorTooltip } from './useErrorTooltip';

export default {
  title: 'Components/useErrorTooltip',
} as Meta;

export function Template(): JSX.Element {
  const [error, setError] = useState('');
  const errorTooltip = useErrorTooltip(Boolean(error));

  return (
    <form>
      <p>
        <label {...errorTooltip.anchor}>
          Value:
          <input name="foo" onInput={() => setError('Totally incorrect!!11')} />
        </label>
      </p>

      <p {...errorTooltip.tooltip}>
        {error}
        <span {...errorTooltip.pointer} />
      </p>
    </form>
  );
}
