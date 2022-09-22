import { FormEvent, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Chain } from '@kiltprotocol/did';

import * as styles from './CreateDidDApp.module.css';

import { CreateDidOriginInput } from '../../channels/CreateDidChannels/types';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { isFullDid } from '../../utilities/did/did';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';

import { backgroundCreateDidChannel } from '../../channels/CreateDidChannels/backgroundCreateDidChannel';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';

interface Props {
  identity: Identity;
}

export function CreateDidDApp({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;

  const data = usePopupData<CreateDidOriginInput>();
  const { origin } = data;

  const passwordField = usePasswordField();

  const error = isFullDid(did);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { keypair, seed } = await passwordField.get(event);

      const { didDocument, signGetStoreTx } = await getIdentityCryptoFromSeed(
        seed,
      );

      const extrinsic = await Chain.getStoreTx(
        didDocument,
        address,
        signGetStoreTx,
      );

      const signedExtrinsic = (await extrinsic.signAsync(keypair)).toHex();

      await backgroundCreateDidChannel.return({ signedExtrinsic });
      window.close();
    },
    [address, passwordField],
  );

  const handleCancel = useCallback(async () => {
    await backgroundCreateDidChannel.throw('Rejected');
    window.close();
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_CreateDidDApp_heading')}</h1>

      <IdentitiesCarousel identity={identity} />

      <section className={styles.details}>
        <p className={styles.label}>{t('view_CreateDidDApp_origin')}</p>
        <p className={styles.origin}>{origin}</p>
      </section>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button onClick={handleCancel} type="button" className={styles.reject}>
          {t('common_action_cancel')}
        </button>
        <button type="submit" className={styles.submit} disabled={error}>
          {t('common_action_sign')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {t('view_CreateDidDApp_error')}
        </output>
      </p>
    </form>
  );
}
