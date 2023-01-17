import { browser } from 'webextension-polyfill-ts';

import { Link } from 'react-router-dom';

import { FormEvent, useCallback } from 'react';

import * as styles from './DidUpgrade.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { paths } from '../paths';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { getTransaction } from '../../utilities/didUpgrade/didUpgrade';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useTXDSubmitter } from '../../utilities/useTXDSubmitter/useTXDSubmitter';
import {
  getIdentityCryptoFromSeed,
  getLightDidFromSeed,
} from '../../utilities/identities/identities';
import {
  getCheckoutURL,
  getCheckoutCosts,
} from '../../utilities/checkout/checkout';

interface Props {
  identity: Identity;
}

export function DidUpgrade({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;

  const passwordField = usePasswordField();

  const cost = useAsyncValue(getCheckoutCosts, [])?.did;
  const submitter = useTXDSubmitter();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!submitter) {
        throw new Error('Submitter address missing');
      }

      const { seed } = await passwordField.get(event);
      const { keypair, sign } = await getIdentityCryptoFromSeed(seed);

      const document = getLightDidFromSeed(seed);
      const { extrinsic } = await getTransaction(
        document,
        keypair,
        sign,
        submitter,
      );

      const checkout = await getCheckoutURL();

      const url = new URL(checkout);
      url.searchParams.set('address', address);
      url.searchParams.set('tx', extrinsic.method.toHex());

      await browser.tabs.create({ url: url.toString() });
      window.close();
    },
    [address, passwordField, submitter],
  );

  if (!cost) {
    return null; // network data pending
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_DidUpgrade_heading')}</h1>
      <p className={styles.subline}>{t('view_DidUpgrade_subline')}</p>

      <IdentitySlide identity={identity} />

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt className={styles.detailName}>{t('view_DidUpgrade_address')}</dt>
          <dd className={styles.detailValue}>{address}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailName}>{t('view_DidUpgrade_method')}</dt>
          <dd className={styles.detailValue}>did.create</dd>
        </div>
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.info}>
        <span>{t('view_DidUpgrade_info')}</span>
        <span className={styles.paypal}>{t('view_DidUpgrade_paypal')}</span>
        <span>{t('view_DidUpgrade_cost', [cost])}</span>
      </p>

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit}>
          {t('common_action_sign')}
        </button>
      </p>

      <LinkBack />
    </form>
  );
}
