import { browser } from 'webextension-polyfill-ts';

import { Link } from 'react-router-dom';

import { FormEvent, useCallback } from 'react';

import ky from 'ky';

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

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useTXDSubmitter } from '../../utilities/useTXDSubmitter/useTXDSubmitter';
import {
  getEndpoint,
  KnownEndpoints,
} from '../../utilities/endpoints/endpoints';

const checkoutURLs: Record<KnownEndpoints, string> = {
  'wss://kilt-rpc.dwellir.com': 'https://checkout.kilt.io',
  'wss://spiritnet.kilt.io': 'https://checkout.kilt.io',
  'wss://peregrine.kilt.io/parachain-public-ws': 'https://dev-checkout.kilt.io',
  'wss://peregrine-stg.kilt.io/para': 'https://dev-checkout.kilt.io',
  'wss://sporran-testnet.kilt.io': 'https://dev-checkout.kilt.io',
};

async function getCheckoutURL() {
  const endpoint = await getEndpoint();
  return checkoutURLs[endpoint];
}

async function getCost() {
  const checkout = await getCheckoutURL();

  const cost = await ky.get(`${checkout}/api/cost`).text();
  return parseFloat(cost).toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
  });
}

interface Props {
  identity: Identity;
}

export function DidUpgradeEuro({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;

  const passwordField = usePasswordField();

  const cost = useAsyncValue(getCost, []);
  const submitter = useTXDSubmitter();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!submitter) {
        throw new Error('Submitter address missing');
      }

      const { seed } = await passwordField.get(event);

      const { extrinsic } = await getTransaction(seed, submitter);

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
    return null;
  }

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
        <span>{t('view_DidUpgradeEuro_cost', [cost])}</span>
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
