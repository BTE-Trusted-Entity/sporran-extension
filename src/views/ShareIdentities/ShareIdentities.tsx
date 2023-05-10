import { FormEvent, JSX, useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { pick } from 'lodash-es';

import * as styles from './ShareIdentities.module.css';

import { usePopupData } from '../../utilities/popups/usePopupData';
import {
  ShareIdentitiesOriginInput,
  ShareIdentitiesOutput,
} from '../../channels/ShareIdentitiesChannels/types';
import { backgroundShareIdentitiesChannel } from '../../channels/ShareIdentitiesChannels/backgroundShareIdentitiesChannel';
import { useIdentities } from '../../utilities/identities/identities';
import { Avatar } from '../../components/Avatar/Avatar';
import { isFullDid } from '../../utilities/did/did';

export function ShareIdentities(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const identities = useIdentities().data;
  const { origin } = usePopupData<ShareIdentitiesOriginInput>();

  const [error, setError] = useState(false);
  const handleChange = useCallback(() => setError(false), []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!identities) {
        return;
      }

      const formData = new FormData(event.currentTarget);
      const includeName = formData.has('names');
      const addresses = [...formData.keys()];
      const selected = Object.values(pick(identities, addresses));

      if (selected.length === 0) {
        setError(true);
        return;
      }

      const result = selected.map(({ name, did }) => {
        const namePart = includeName ? { name } : undefined;
        const didPart = isFullDid(did) ? { did } : { pendingDid: did };
        return { ...namePart, ...didPart };
      }) as ShareIdentitiesOutput;
      await backgroundShareIdentitiesChannel.return(result);
      window.close();
    },
    [identities],
  );

  const handleCancel = useCallback(async () => {
    await backgroundShareIdentitiesChannel.throw('Rejected');
    window.close();
  }, []);

  if (!identities) {
    return null; // storage data pending
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_GetDidList_heading')}</h1>

      <section className={styles.details}>
        <p className={styles.label}>{t('view_GetDidList_origin')}</p>
        <p className={styles.origin}>{origin}</p>
      </section>

      <h2 className={styles.choose}>{t('view_GetDidList_choose')}</h2>

      <ul className={styles.identities}>
        {Object.values(identities).map((identity) => {
          const { name, did, address } = identity;
          const inactive = !did;
          return (
            <li key={address}>
              <label className={styles.identityLine}>
                <input
                  className={styles.namesInput}
                  type="checkbox"
                  name={address}
                  onChange={handleChange}
                  disabled={inactive}
                />
                <span />
                <Avatar identity={identity} className={styles.avatar} />
                <span className={inactive ? styles.disabled : styles.name}>
                  {inactive && t('view_GetDidList_deleted')}
                  {name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p>
        <label className={styles.names}>
          <input className={styles.namesInput} type="checkbox" name="names" />
          <span />
          {t('view_GetDidList_names')}
        </label>
      </p>

      <p className={styles.buttonsLine}>
        <button onClick={handleCancel} type="button" className={styles.reject}>
          {t('common_action_cancel')}
        </button>
        <button type="submit" className={styles.submit}>
          {t('view_GetDidList_share')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {t('view_GetDidList_choose')}
        </output>
      </p>
    </form>
  );
}
