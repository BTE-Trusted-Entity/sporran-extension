import { Meta } from '@storybook/react';
import { usePasteButton } from './usePasteButton';
import { useRef } from 'react';

export default {
  title: 'Components/usePasteButton',
} as Meta;

export function Template(): JSX.Element {
  const ref = useRef(null);
  const copy = usePasteButton(ref);

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
