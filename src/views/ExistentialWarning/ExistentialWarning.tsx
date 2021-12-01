import { browser } from 'webextension-polyfill-ts';
import { Link, useNavigate } from 'react-router-dom';

import { LinkBack } from '../../components/LinkBack/LinkBack';

import * as styles from './ExistentialWarning.module.css';
import { useCallback } from 'react';

interface Props {
  nextPath: string;
}

export function ExistentialWarning({ nextPath }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const navigate = useNavigate();
  const goBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>
        {t('view_ExistentialWarning_headline')}
      </h1>

      <p className={styles.subline}>{t('view_ExistentialWarning_subline')}</p>

      <p className={styles.warning}>{t('view_ExistentialWarning_warning')}</p>

      <p className={styles.buttonsLine}>
        <Link className={styles.confirm} to={nextPath}>
          {t('view_ExistentialWarning_confirm')}
        </Link>
        <button className={styles.cancel} onClick={goBack}>
          {t('common_action_cancel')}
        </button>
      </p>

      <LinkBack />
    </div>
  );
}
