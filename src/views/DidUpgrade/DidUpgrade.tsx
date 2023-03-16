import { FormEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';

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
import {
  getIdentityCryptoFromSeed,
  getLightDidFromSeed,
} from '../../utilities/identities/identities';
import {
  getCheckoutURL,
  getCheckoutCosts,
} from '../../utilities/checkout/checkout';
import { parseDidUri } from '../../utilities/did/did';

interface Props {
  identity: Identity;
}

export function DidUpgrade({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;

  const passwordField = usePasswordField();

  const costs = useAsyncValue(getCheckoutCosts, []);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!costs) {
        throw new Error('Submitter address missing');
      }
      if (!did) {
        throw new Error('DID missing');
      }

      const { seed } = await passwordField.get(event);
      const { keypair, sign } = await getIdentityCryptoFromSeed(seed);

      const document = getLightDidFromSeed(seed);
      const { extrinsic } = await getTransaction(
        document,
        keypair,
        sign,
        costs?.paymentAddress,
      );

      const checkout = await getCheckoutURL();

      const url = new URL(checkout);
      url.searchParams.set('address', address);
      url.searchParams.set('tx', extrinsic.method.toHex());
      const { fullDid } = parseDidUri(did);
      url.searchParams.set('did', fullDid);

      await browser.tabs.create({ url: url.toString() });
      window.close();
    },
    [did, passwordField, costs, address],
  );

  if (!costs) {
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
        <span>{t('view_DidUpgrade_cost', [costs.did])}</span>
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
