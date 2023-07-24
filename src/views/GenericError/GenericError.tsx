import { Component, JSX } from 'react';
import { Modal } from 'react-dialog-polyfill';
import browser from 'webextension-polyfill';

import * as overlayStyles from '../../components/Overlay/Overlay.module.css';
import * as styles from './GenericError.module.css';

import { configuration } from '../../configuration/configuration';

interface Props {
  children: JSX.Element;
}

interface State {
  errorText?: string;
}

export class GenericError extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return {
      errorText: `Sporran@${configuration.version}\n\n${error.message}\n\n${error.stack}`,
    };
  }

  render(): JSX.Element {
    if (!this.state.errorText) {
      return this.props.children;
    }

    const t = browser.i18n.getMessage;

    return (
      <main>
        <Modal open className={styles.overlay}>
          <p
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: t('view_GenericError_message') }}
          />

          <textarea
            className={styles.details}
            readOnly
            aria-label={t('view_GenericError_details')}
            defaultValue={this.state.errorText}
            onFocus={(event) => {
              event.target.select();
            }}
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
