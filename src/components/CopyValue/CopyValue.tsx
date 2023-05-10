import { JSX, useRef } from 'react';

import * as styles from './CopyValue.module.css';

import { useCopyButton } from '../useCopyButton/useCopyButton';

interface Props {
  value: string;
  label?: string;
  labelledBy?: string;
  className?: string;
}

export function CopyValue({
  value,
  label,
  labelledBy,
  className = styles.line,
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const copy = useCopyButton(inputRef);

  const longValue = value.length > 52;

  return (
    <p className={className}>
      <input
        className={longValue ? styles.long : styles.input}
        ref={inputRef}
        readOnly
        value={value}
        {...(label && { 'aria-label': label })}
        {...(labelledBy && { 'aria-labelledby': labelledBy })}
      />
      {copy.supported && (
        <button
          className={copy.className}
          onClick={copy.handleCopyClick}
          type="button"
          aria-label={copy.title}
          title={copy.title}
        />
      )}
    </p>
  );
}
