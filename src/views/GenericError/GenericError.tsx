import { Component } from 'react';
import { Modal } from 'react-dialog-polyfill';
import { browser } from 'webextension-polyfill-ts';

import * as overlayStyles from '../../components/Overlay/Overlay.module.css';
import * as styles from './GenericError.module.css';

interface Props {
  children: JSX.Element;
}

interface State {
  hasError: boolean;
}

export class GenericError extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render(): JSX.Element {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const t = browser.i18n.getMessage;

    return (
      <main>
        <Modal open className={overlayStyles.overlay}>
          <p
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: t('view_GenericError_message') }}
          />

          <button
            type="button"
            onClick={() => window.close()}
            className={overlayStyles.button}
          >
            {t('common_action_close')}
          </button>
        </Modal>
      </main>
    );
  }
}
