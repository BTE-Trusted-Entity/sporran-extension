import { Meta } from '@storybook/react';
import { MouseEvent, useState } from 'react';

import { GenericError } from './GenericError';

export default {
  title: 'Views/GenericError',
  component: GenericError,
} as Meta;

function Failure() {
  const [error, setError] = useState<MouseEvent | null>(null);

  if (error) {
    throw new Error('Render failure triggered');
  }

  return (
    <button type="button" onClick={setError}>
      Trigger error
    </button>
  );
}

export function Template() {
  return (
    <GenericError>
      <Failure />
    </GenericError>
  );
}
