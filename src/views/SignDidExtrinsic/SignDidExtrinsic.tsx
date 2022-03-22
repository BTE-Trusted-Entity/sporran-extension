import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { map } from 'lodash-es';
import { GenericCall } from '@polkadot/types';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { BaseDidKey } from '@kiltprotocol/types';

import * as styles from './SignDidExtrinsic.module.css';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';
import { getFullDidDetails, isFullDid } from '../../utilities/did/did';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignDidExtrinsicChannel } from '../../channels/SignDidExtrinsicChannels/backgroundSignDidExtrinsicChannel';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';

interface Value {
  value: ReactNode;
  label: string;
}

export function useExtrinsicValues(
  input: SignDidExtrinsicOriginInput,
): Value[] {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    (async () => {
      const t = browser.i18n.getMessage;

      const { origin } = input;
      const { api } = await BlockchainApiConnection.getConnectionOrConnect();

      const extrinsic = api.createType('Extrinsic', input.extrinsic);

      const { meta } = extrinsic;
      const { section } = extrinsic.method;

      const forbidden = section === 'did';
      const errorLine = {
        label: 'FORBIDDEN',
        value: 'All did.* calls are forbidden',
      };
      const error = !forbidden ? [] : [errorLine];

      const argumentValues = (extrinsic.method as GenericCall).toHuman()
        .args as Record<string, unknown>;
      const argumentNames = meta && map(meta.args, 'name');
      const nameValuePairs = argumentNames.map(
        (name) =>
          `${name} = ${JSON.stringify(argumentValues[name.toString()])}`,
      );
      const methodSignature = meta ? `(${nameValuePairs.join(', ')})` : '';

      const method = `${section}.${extrinsic.method.method}${methodSignature}`;

      setValues([
        ...error,
        { value: origin, label: t('view_SignDidExtrinsic_from') },
        { value: method, label: t('view_SignDidExtrinsic_method') },
      ]);
    })();
  }, [input]);

  return values;
}

interface Props {
  identity: Identity;
}

export function SignDidExtrinsic({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const error = !isFullDid(identity.did);

  const data = usePopupData<SignDidExtrinsicOriginInput>();
  const values = useExtrinsicValues(data);
  const { extrinsic, signer } = data;

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { api } = await BlockchainApiConnection.getConnectionOrConnect();
      const draft = api.createType('Extrinsic', extrinsic);

      if (draft.method.section === 'did') {
        throw new Error('Signing DID calls not allowed');
      }

      const fullDidDetails = await getFullDidDetails(identity.did);

      const { seed } = await passwordField.get(event);
      const { keystore } = await getIdentityCryptoFromSeed(seed);

      let didKey: BaseDidKey | undefined;
      const authorized = await fullDidDetails.authorizeExtrinsic(
        draft,
        keystore,
        signer,
        {
          async keySelection([key]) {
            didKey = key;
            return key;
          },
        },
      );

      if (!didKey) {
        throw new Error('No extrinsic signing key stored');
      }
      const didKeyUri = fullDidDetails.assembleKeyId(didKey.id);
      const signed = authorized.toHex();

      await backgroundSignDidExtrinsicChannel.return({ signed, didKeyUri });

      window.close();
    },
    [extrinsic, identity.did, passwordField, signer],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidExtrinsicChannel.throw('Rejected');
    window.close();
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDidExtrinsic_title')}</h1>
      <p className={styles.subline}>{t('view_SignDidExtrinsic_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      <dl className={styles.details}>
        {values.map(({ label, value }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd className={styles.detailValue} title={String(value)}>
              {value}
            </dd>
          </Fragment>
        ))}
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDidExtrinsic_reject')}
        </button>
        <button type="submit" className={styles.submit} disabled={error}>
          {t('common_action_sign')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {t('view_SignDidExtrinsic_error')}
        </output>
      </p>
    </form>
  );
}
