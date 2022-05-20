import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';

import * as styles from './DidUpgradeExplainer.module.css';

import { Identity } from '../../utilities/identities/types';
import { parseDidUri } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Avatar } from '../../components/Avatar/Avatar';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';

interface Props {
  identity: Identity;
}

export function DidUpgradeExplainer({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;

  const wasOnChainDidDeleted = useIsOnChainDidDeleted(did);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidUpgradeExplainer_heading')}
      </h1>

      {wasOnChainDidDeleted && (
        <Fragment>
          <p className={styles.subline}>
            {t('view_DidUpgradeExplainer_onchain_deleted_subline')}
          </p>

          <IdentitySlide identity={identity} />

          <CopyValue
            value={parseDidUri(did).fullDid}
            label="DID"
            className={styles.didLine}
          />
          <p className={styles.deleted}>
            {t('view_DidUpgradeExplainer_onchain_deleted')}
          </p>
          <Link to={paths.home} className={styles.back}>
            {t('common_action_back')}
          </Link>
        </Fragment>
      )}

      {!wasOnChainDidDeleted && (
        <Fragment>
          <p className={styles.subline}>
            {t('view_DidUpgradeExplainer_subline')}
          </p>

          <IdentitySlide identity={identity} />

          <div className={styles.functionality}>
            <Avatar className={styles.avatar} identity={identity} />
            {t('view_DidUpgradeExplainer_functionality')}
          </div>
          <p className={styles.deposit}>
            {t('view_DidUpgradeExplainer_deposit')}
          </p>

          <p className={styles.buttonsLine}>
            <Link to={paths.home} className={styles.cancel}>
              {t('common_action_cancel')}
            </Link>
            <Link
              to={generatePath(paths.identity.did.upgrade.sign, { address })}
              className={styles.upgrade}
              aria-disabled={wasOnChainDidDeleted}
            >
              {t('view_DidUpgradeExplainer_CTA')}
            </Link>
          </p>
        </Fragment>
      )}

      <LinkBack />
      <Stats />
    </section>
  );
}
