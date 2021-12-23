import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './AddIdentity.module.css';

import { paths } from '../../views/paths';
import { useIdentities } from '../../utilities/identities/identities';

export function AddIdentity(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const identities = useIdentities().data;
  const hasIdentities = identities && Object.values(identities).length > 0;

  if (!hasIdentities) {
    return null; // storage data pending
  }

  return (
    <Link
      className={styles.toggle}
      to={paths.identity.add}
      title={t('component_AddIdentity_label')}
      aria-label={t('component_AddIdentity_label')}
    />
  );
}
