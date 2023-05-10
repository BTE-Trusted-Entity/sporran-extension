import { Meta } from '@storybook/react';
import { JSX, useRef } from 'react';

import { useCopyButton } from './useCopyButton';

export default {
  title: 'Components/useCopyButton',
} as Meta;

export function Template(): JSX.Element {
  const ref = useRef(null);
  const copy = useCopyButton(ref);

  return (
    <form>
      <label>
        Input: <input ref={ref} />
      </label>

      {copy.supported && (
        <button
          className={copy.className}
          type="button"
          onClick={copy.handleCopyClick}
          title={copy.title}
          aria-label={copy.title}
        />
      )}
    </form>
  );
}
