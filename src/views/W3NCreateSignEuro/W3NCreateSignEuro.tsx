import { FormEvent, JSX, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { ConfigService, Did } from '@kiltprotocol/sdk-js';

import * as styles from './W3NCreateSignEuro.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import {
  getIdentityCryptoFromSeed,
  getIdentityDid,
} from '../../utilities/identities/identities';
import {
  getCheckoutCosts,
  getCheckoutURL,
} from '../../utilities/checkout/checkout';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

interface Props {
  identity: Identity;
}

export function W3NCreateSignEuro({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const history = useHistory();
  const { goBack } = history;

  const { web3name } = useParams() as { web3name: string };

  const did = getIdentityDid(identity);

  const costs = useAsyncValue(getCheckoutCosts, []);
  const cost = costs?.w3n;
  const submitter = costs?.paymentAddress;

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { did } = identity;

      if (!submitter || !did) {
        return;
      }

      const { seed } = await passwordField.get(event);
      const { sign } = await getIdentityCryptoFromSeed(seed);

      const api = ConfigService.get('api');
      const authorized = await Did.authorizeTx(
        did,
        api.tx.web3Names.claim(web3name),
        sign,
        submitter,
      );

      const checkout = await getCheckoutURL();

      const url = new URL(checkout);
      url.searchParams.set('web3name', web3name);
      url.searchParams.set('did', did);
      url.searchParams.set('tx', authorized.method.toHex());

      await browser.tabs.create({ url: url.toString() });
      window.close();
    },
    [identity, passwordField, submitter, web3name],
  );

  if (!cost) {
    return null; // network data pending
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_W3NCreateSignEuro_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreateSignEuro_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={did} label="DID" className={styles.didLine} />

      <p className={styles.details}>
        <span className={styles.label}>
          {t('view_W3NCreateSignEuro_label')}
        </span>
        {web3name}
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.info}>{t('view_W3NCreateSignEuro_cost', [cost])}</p>

      <p className={styles.buttonsLine}>
        <button type="button" onClick={goBack} className={styles.back}>
          {t('common_action_back')}
        </button>

        <button type="submit" className={styles.next}>
          {t('common_action_sign')}
        </button>
      </p>

      <LinkBack />
      <Stats />
    </form>
  );
}
