import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { generatePath, Link, useHistory, useParams } from 'react-router-dom';
import browser from 'webextension-polyfill';

import * as styles from './W3NCreateChoose.module.css';

import { Identity } from '../../utilities/identities/types';
import { getIdentityDid } from '../../utilities/identities/identities';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { paths } from '../paths';
import { useKiltCosts } from '../../utilities/w3nCreate/w3nCreate';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { getCheckoutCosts } from '../../utilities/checkout/checkout';

type PaymentMethod = 'kilt' | 'euro';

interface Props {
  identity: Identity;
}

export function W3NCreateChoose({ identity }: Props) {
  const t = browser.i18n.getMessage;
  const { address } = identity;
  const did = getIdentityDid(identity);

  const { web3name } = useParams() as { web3name: string };

  const history = useHistory();
  const { goBack } = history;

  const euroCost = useAsyncValue(getCheckoutCosts, [])?.w3n;
  const { total: kiltCosts, insufficientKilt } = useKiltCosts(address, did);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kilt');

  useEffect(() => {
    if (insufficientKilt) {
      setPaymentMethod('euro');
    }
  }, [insufficientKilt]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as PaymentMethod);
  }, []);

  if (!kiltCosts) {
    return null; // blockchain data pending
  }
  if (!euroCost) {
    return null; // network data pending
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_W3NCreateChoose_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreateChoose_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={did} label="DID" className={styles.didLine} />

      <p className={styles.web3Name}>w3n:{web3name}</p>

      <p className={styles.info}>{t('view_W3NCreateChoose_info')}</p>

      <section
        className={
          insufficientKilt ? styles.paymentMethodsError : styles.paymentMethods
        }
      >
        <p className={styles.paymentMethod}>
          <label
            className={insufficientKilt ? styles.insufficientKilt : styles.kilt}
          >
            <input
              type="radio"
              name="payment"
              value="kilt"
              checked={paymentMethod === 'kilt'}
              onChange={handleChange}
              className={styles.select}
              disabled={insufficientKilt}
            />

            {t('view_W3NCreateChoose_kilt', [asKiltCoins(kiltCosts, 'costs')])}
          </label>

          <output className={styles.errorTooltip} hidden={!insufficientKilt}>
            {t('view_W3NCreateChoose_insufficientKilt', [
              asKiltCoins(kiltCosts, 'costs'),
            ])}
          </output>
        </p>

        <p className={styles.paymentMethod}>
          <label className={styles.euro}>
            <input
              type="radio"
              name="payment"
              value="euro"
              checked={paymentMethod === 'euro'}
              onChange={handleChange}
              className={styles.select}
            />
            {t('view_W3NCreateChoose_euro', [euroCost])}
          </label>
        </p>
      </section>

      <p className={styles.buttonsLine}>
        <button type="button" onClick={goBack} className={styles.back}>
          {t('common_action_back')}
        </button>

        <Link
          to={generatePath(paths.identity.web3name.create[paymentMethod], {
            address,
            web3name,
          })}
          className={styles.upgrade}
        >
          {t('common_action_continue')}
        </Link>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
