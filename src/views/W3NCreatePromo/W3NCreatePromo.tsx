import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';

import { Web3Names } from '@kiltprotocol/did';

import * as styles from './W3NCreatePromo.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { generatePath, paths } from '../paths';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { getKeystoreFromSeed } from '../../utilities/identities/identities';
import { getFullDidDetails } from '../../utilities/did/did';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import {
  getPromoStatus,
  submitDidCall,
  waitFinalized,
} from '../../utilities/promoBackend/promoBackend';

interface Props {
  identity: Identity;
  web3name: string;
}

export function W3NCreatePromo({
  identity,
  web3name,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const destination = generatePath(paths.identity.did.manage.start, {
    address,
  });

  const fullDidDetails = useSwrDataOrThrow(
    did,
    getFullDidDetails,
    'getFullDidDetails',
  );

  const promoStatus = useSwrDataOrThrow('', getPromoStatus, 'getPromoStatus');

  const [txHash, setTxHash] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | null>(
    null,
  );

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        if (!fullDidDetails) {
          throw new Error('Did details missing');
        }
        if (!promoStatus) {
          throw new Error('Promo status data missing');
        }

        const { seed } = await passwordField.get(event);

        setSubmitting(true);
        setStatus('pending');

        const extrinsic = await Web3Names.getClaimTx(web3name);

        const authorized = await fullDidDetails.authorizeExtrinsic(
          extrinsic,
          await getKeystoreFromSeed(seed),
          promoStatus.account,
        );

        const { tx_hash } = await submitDidCall(authorized);
        setTxHash(tx_hash);

        const finalized = await waitFinalized(tx_hash);
        if (!finalized) {
          throw new Error('Error finalizing transaction');
        }

        setStatus('success');
      } catch (error) {
        setSubmitting(false);
        setStatus('error');
        console.error(error);
      }
    },
    [fullDidDetails, passwordField, web3name, promoStatus],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_W3NCreatePromo_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreatePromo_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      <p className={styles.costs}>
        {t('view_W3NCreatePromo_total')}
        <KiltAmount amount={new BN(0)} type="costs" smallDecimals />
      </p>

      <p className={styles.details}>{t('view_W3NCreatePromo_info')}</p>

      <p className={styles.details}>
        <span className={styles.label}>{t('view_W3NCreatePromo_label')}</span>
        {web3name}
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={destination} className={styles.back}>
          {t('common_action_cancel')}
        </Link>

        <button type="submit" className={styles.next} disabled={submitting}>
          {t('common_action_sign')}
        </button>
      </p>

      {status && (
        <TxStatusModal
          identity={identity}
          status={status}
          txHash={txHash}
          onDismissError={closeModal}
          destination={destination}
          messages={{
            pending: t('view_W3NCreatePromo_pending'),
            success: t('view_W3NCreatePromo_success'),
            error: t('view_W3NCreatePromo_error'),
          }}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
