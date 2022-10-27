import { browser } from 'webextension-polyfill-ts';

import { Link } from 'react-router-dom';

import { FormEvent, useCallback } from 'react';

import * as styles from './DidUpgradeEuro.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { paths } from '../paths';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { getTransaction } from '../../utilities/didUpgrade/didUpgrade';

interface Props {
  identity: Identity;
}

// TODO: Use KILT Checkout URL when available
const base = 'https://www.kilt.io/';

// TODO: Fetch costs from KILT checkout API
const costs = '4,00';

// TODO: Fetch submitter address from TXD
const submitter = '4t37z5PrEH9zz93cQ2of8F9kYMPrmWcRMBckJtNGF8keSW5W';

export function DidUpgradeEuro({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);

      const { extrinsic } = await getTransaction(seed, submitter);

      const url = new URL(base);
      url.searchParams.set('address: ', address);
      url.searchParams.set('tx', extrinsic.method.toHex());

      await browser.tabs.create({ url: url.toString() });
    },
    [address, passwordField],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_DidUpgradeEuro_heading')}</h1>
      <p className={styles.subline}>{t('view_DidUpgradeEuro_subline')}</p>

      <IdentitySlide identity={identity} />

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt className={styles.detailName}>
            {t('view_DidUpgradeEuro_address')}
          </dt>
          <dd className={styles.detailValue}>{address}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailName}>
            {t('view_DidUpgradeEuro_method')}
          </dt>
          <dd className={styles.detailValue}>did.create</dd>
        </div>
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.info}>
        <span>{t('view_DidUpgradeEuro_info')}</span>
        <span className={styles.paypal}>{t('view_DidUpgradeEuro_paypal')}</span>
        <span>{t('view_DidUpgradeEuro_costs', [costs])}</span>
      </p>

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit}>
          {t('common_action_sign')}
        </button>
      </p>

      <p className={styles.footnote}>{t('view_DidUpgradeEuro_footnote')}</p>

      <LinkBack />
    </form>
  );
}
