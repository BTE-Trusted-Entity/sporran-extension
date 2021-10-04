import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';

import styles from './DidDowngradeExplainer.module.css';

interface Props {
  identity: Identity;
}

export function DidDowngradeExplainer({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidDowngradeExplainer_heading')}
      </h1>
      <p className={styles.subline}>
        {t('view_DidDowngradeExplainer_subline')}
      </p>

      <IdentitySlide identity={identity} />

      <p className={styles.explanation}>
        {t('view_DidDowngradeExplainer_explanation')}
      </p>

      <p className={styles.warning}>
        {t('view_DidDowngradeExplainer_warning')}
      </p>

      <Link
        to={generatePath(paths.identity.did.downgrade.sign, {
          address: identity.address,
        })}
        className={styles.continue}
      >
        {t('view_DidDowngradeExplainer_CTA')}
      </Link>

      <LinkBack />
      <Stats />
    </section>
  );
}
