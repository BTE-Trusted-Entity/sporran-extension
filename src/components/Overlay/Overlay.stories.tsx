import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import overlayStyles from './Overlay.module.css';

export default {
  title: 'Components/Overlay',
} as Meta;

export function Template(): JSX.Element {
  return (
    <div className={overlayStyles.overlay} style={{ float: 'right' }}>
      <h1 className={overlayStyles.heading}>{'Heading'}</h1>
      <p className={overlayStyles.text}>{'Overlay Text'}</p>
      <button
        type="button"
        className={overlayStyles.button}
        onClick={action('closeOverlay')}
      >
        OK
      </button>
    </div>
  );
}
