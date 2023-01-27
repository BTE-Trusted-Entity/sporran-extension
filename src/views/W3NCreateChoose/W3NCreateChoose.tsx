import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, generatePath, useParams, Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './W3NCreateChoose.module.css';

import { Identity } from '../../utilities/identities/types';
import { getIdentityDid } from '../../utilities/identities/identities';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { paths } from '../paths';
import { useKiltCosts } from '../../utilities/w3nCreate/w3nCreate';
import { ExplainerModal } from '../../components/ExplainerModal/ExplainerModal';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';

type PaymentMethod = 'kilt' | 'euro';

interface Props {
  identity: Identity;
}

export function W3NCreateChoose({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { address } = identity;
  const did = getIdentityDid(identity);

  const { web3name } = useParams() as { web3name: string };

  const history = useHistory();
  const { goBack } = history;

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

  const portalRef = useRef<HTMLDivElement>(null);

  if (!kiltCosts) {
    return null; // blockchain data pending
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

            {t('view_W3NCreateChoose_kilt')}
          </label>

          <ExplainerModal
            label={t('view_W3NCreateChoose_kilt_info')}
            portalRef={portalRef}
          >
            {t('view_W3NCreateChoose_kilt_explainer')}
          </ExplainerModal>

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
            {t('view_W3NCreateChoose_euro')}
          </label>

          <ExplainerModal
            label={t('view_W3NCreateChoose_euro_info')}
            portalRef={portalRef}
          >
            {t('view_W3NCreateChoose_euro_explainer')}
          </ExplainerModal>
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
          {t('common_action_next')}
        </Link>
      </p>

      <div ref={portalRef} />

      <LinkBack />
      <Stats />
    </section>
  );
}
