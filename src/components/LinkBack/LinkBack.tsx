import { Link, useHistory, useParams } from 'react-router-dom';
import browser from 'webextension-polyfill';

import * as styles from './LinkBack.module.css';

import { generatePath } from '../../views/paths';

interface Props {
  to?: string;
}

export function LinkBack({ to }: Props) {
  const t = browser.i18n.getMessage;

  const { goBack } = useHistory();
  const params = useParams();

  if (to) {
    return (
      <Link
        title={t('common_action_back')}
        aria-label={t('common_action_back')}
        to={generatePath(to, params)}
        className={styles.linkBack}
      />
    );
  }

  return (
    <button
      type="button"
      title={t('common_action_back')}
      aria-label={t('common_action_back')}
      onClick={goBack}
      className={styles.linkBack}
    />
  );
}
