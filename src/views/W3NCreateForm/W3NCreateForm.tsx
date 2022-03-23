import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Web3Names } from '@kiltprotocol/did';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { u32 } from '@polkadot/types';

import * as styles from './W3NCreateForm.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';

interface Props {
  identity: Identity;
  onSubmit: (name: string) => void;
}

export function W3NCreateForm({ identity, onSubmit }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { goBack } = useHistory();

  const [error, setError] = useState('');
  const handleInput = useCallback(() => setError(''), []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target as HTMLFormElement);
      const value = formData.get('name') as string;
      const name = value.trim();

      const { api } = await BlockchainApiConnection.getConnectionOrConnect();
      const minLength = (api.consts.web3Names.minNameLength as u32).toNumber();
      const maxLength = (api.consts.web3Names.maxNameLength as u32).toNumber();

      const tooShort = name.length < minLength;
      if (tooShort) {
        setError(t('view_W3NCreateForm_short', minLength));
        return;
      }

      const tooLong = name.length > maxLength;
      if (tooLong) {
        setError(t('view_W3NCreateForm_long', maxLength));
        return;
      }

      const unexpected = name.match(/[^.a-z0-9_-]/);
      if (unexpected) {
        setError(t('view_W3NCreateForm_unexpected', unexpected[0]));
        return;
      }

      // TODO: if the future blockchain versions do not fix the stale link issue, consider a workaround here
      const taken = Boolean(await Web3Names.queryDidForWeb3Name(name));
      if (taken) {
        setError(t('view_W3NCreateForm_taken'));
        return;
      }

      onSubmit(name);
    },
    [t, onSubmit],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_W3NCreateForm_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreateForm_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      <p className={styles.info}>{t('view_W3NCreateForm_info')}</p>

      <p className={styles.inputLine}>
        <input
          type="input"
          name="name"
          className={styles.input}
          required
          placeholder={t('view_W3NCreateForm_placeholder')}
          onInput={handleInput}
        />

        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>

      <p className={styles.buttonsLine}>
        <button type="button" onClick={goBack} className={styles.back}>
          {t('common_action_back')}
        </button>

        <button type="submit" className={styles.next}>
          {t('common_action_next')}
        </button>
      </p>

      <LinkBack />
      <Stats />
    </form>
  );
}
