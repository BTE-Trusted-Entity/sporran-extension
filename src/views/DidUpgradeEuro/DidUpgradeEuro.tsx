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
import {
  getEndpoint,
  KnownEndpoints,
} from '../../utilities/endpoints/endpoints';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

// TODO: Fetch submitter address from TXD
const submitter = '4t37z5PrEH9zz93cQ2of8F9kYMPrmWcRMBckJtNGF8keSW5W';

const kiltCheckoutURLs: Record<KnownEndpoints, string> = {
  'wss://kilt-rpc.dwellir.com': 'https://checkout.kilt.io',
  'wss://spiritnet.kilt.io': 'https://checkout.kilt.io',
  'wss://peregrine.kilt.io/parachain-public-ws': 'https://dev-checkout.kilt.io',
  'wss://peregrine-stg.kilt.io/para': 'https://dev-checkout.kilt.io',
  'wss://sporran-testnet.kilt.io': 'https://dev-checkout.kilt.io',
};

// TODO: return TXD URL when it works to fetch submitter address
async function getExternalURLs(): Promise<{ checkoutBaseURL: string }> {
  const endpoint = await getEndpoint();

  return { checkoutBaseURL: kiltCheckoutURLs[endpoint] };
}

async function getCost() {
  const { checkoutBaseURL } = await getExternalURLs();

  const cost = await ky.get(`${checkoutBaseURL}/cost`).text();
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

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);

      const { extrinsic } = await getTransaction(seed, submitter);

      const { checkoutBaseURL } = await getExternalURLs();

      const url = new URL(checkoutBaseURL);
      url.searchParams.set('address', address);
      url.searchParams.set('tx', extrinsic.method.toHex());

      await browser.tabs.create({ url: url.toString() });
      window.close();
    },
    [address, passwordField],
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

      <p className={styles.footnote}>{t('view_DidUpgradeEuro_footnote')}</p>

      <LinkBack />
    </form>
  );
}
