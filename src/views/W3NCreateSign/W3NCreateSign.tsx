import { FormEvent, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { FullDidDetails, Web3Names } from '@kiltprotocol/did';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import * as styles from './W3NCreateSign.module.css';

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
import {
  getIdentityDid,
  getKeypairBySeed,
  getKeystoreFromSeed,
} from '../../utilities/identities/identities';
import { useFullDidDetails } from '../../utilities/did/did';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import {
  asKiltCoins,
  KiltAmount,
} from '../../components/KiltAmount/KiltAmount';
import { KiltCurrency } from '../../components/KiltCurrency/KiltCurrency';
import { ExplainerModal } from '../../components/ExplainerModal/ExplainerModal';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useDepositWeb3Name } from '../../utilities/getDeposit/getDeposit';

async function getFee(fullDid?: FullDidDetails) {
  if (!fullDid) {
    return undefined;
  }

  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);

  const extrinsic = await Web3Names.getClaimTx(
    '01234567890123456789012345678901',
  );
  const authorized = await fullDid.authorizeExtrinsic(
    extrinsic,
    await getKeystoreFromSeed(fakeSeed),
    keypair.address,
  );
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const signed = await blockchain.signTx(keypair, authorized);
  return (await signed.paymentInfo(keypair)).partialFee;
}

interface Props {
  identity: Identity;
}

export function W3NCreateSign({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { web3name } = useParams() as { web3name: string };

  const { address } = identity;
  const did = getIdentityDid(identity);

  const destination = generatePath(paths.identity.did.manage.start, {
    address,
  });

  const fullDidDetails = useFullDidDetails(did);
  const fee = useAsyncValue(getFee, [fullDidDetails]);
  const deposit = useDepositWeb3Name(did)?.amount;

  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!fullDidDetails) {
        return;
      }

      const { keypair, seed } = await passwordField.get(event);

      const extrinsic = await Web3Names.getClaimTx(web3name);
      const authorized = await fullDidDetails.authorizeExtrinsic(
        extrinsic,
        await getKeystoreFromSeed(seed),
        keypair.address,
      );
      await submit(keypair, authorized);
    },
    [fullDidDetails, passwordField, submit, web3name],
  );

  const portalRef = useRef<HTMLDivElement>(null);

  if (!deposit || !fee || !fullDidDetails) {
    return null; // blockchain data pending
  }

  const total = deposit.add(fee);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_W3NCreateSign_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreateSign_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={did} label="DID" className={styles.didLine} />

      <p className={styles.costs}>
        {t('view_W3NCreateSign_total')}
        <KiltAmount amount={total} type="costs" smallDecimals />
      </p>
      <p className={styles.details}>
        <ExplainerModal portalRef={portalRef}>
          {t('view_W3NCreateSign_explainer')}
        </ExplainerModal>
        {t('view_W3NCreateSign_deposit')}
        {asKiltCoins(deposit, 'costs')} <KiltCurrency />
        {t('view_W3NCreateSign_fee')}
        {asKiltCoins(fee, 'costs')} <KiltCurrency />
      </p>
      <p className={styles.details}>
        <span className={styles.label}>{t('view_W3NCreateSign_label')}</span>
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

        <output
          className={styles.errorTooltip}
          hidden={!unpaidCosts || Boolean(modalProps)}
        >
          {t('view_W3NCreateSign_insufficientFunds', [unpaidCosts])}
        </output>
      </p>

      {modalProps && (
        <TxStatusModal
          {...modalProps}
          identity={identity}
          destination={destination}
          messages={{
            pending: t('view_W3NCreateSign_pending'),
            success: t('view_W3NCreateSign_success'),
            error: t('view_W3NCreateSign_error'),
          }}
        />
      )}

      <div ref={portalRef} />

      <LinkBack />
      <Stats />
    </form>
  );
}
