import { Meta } from '@storybook/react';
import { JSX, MouseEvent, useState } from 'react';

import { GenericError } from './GenericError';

export default {
  title: 'Views/GenericError',
  component: GenericError,
} as Meta;

function Failure(): JSX.Element {
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

export function Template(): JSX.Element {
  return (
    <GenericError>
      <Failure />
    </GenericError>
  );
}
