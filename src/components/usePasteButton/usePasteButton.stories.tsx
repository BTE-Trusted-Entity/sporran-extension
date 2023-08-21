import { useRef } from 'react';
import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { usePasteButton } from './usePasteButton';

export default {
  title: 'Components/usePasteButton',
} as Meta;

export function Template() {
  const ref = useRef(null);
  const copy = usePasteButton(ref, action('onPaste'));

  return (
    <form>
      <label>
        Input: <input ref={ref} />
      </label>

      {copy.supported && (
        <button
          className={copy.className}
          type="button"
          onClick={copy.handlePasteClick}
          title={copy.title}
          aria-label={copy.title}
        />
      )}
    </form>
  );
}
