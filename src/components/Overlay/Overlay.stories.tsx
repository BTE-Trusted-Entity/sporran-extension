import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { Modal } from 'react-dialog-polyfill';

import * as overlayStyles from './Overlay.module.css';

export default {
  title: 'Components/Overlay',
} as Meta;

export function Template() {
  return (
    <Modal open className={overlayStyles.overlay}>
      <h1 className={overlayStyles.heading}>Heading</h1>
      <p className={overlayStyles.text}>Overlay Text</p>
      <button
        type="button"
        className={overlayStyles.button}
        onClick={action('closeOverlay')}
      >
        OK
      </button>
    </Modal>
  );
}
