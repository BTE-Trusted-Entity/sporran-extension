import { useState, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, useHistory } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../paths';

import {
  vestChannel,
  insufficientFunds,
} from '../../channels/VestingChannels/VestingChannels';

import { Avatar } from '../../components/Avatar/Avatar';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';

import styles from './UnlockVestedFunds.module.css';

interface Props {
  identity: Identity;
}

export function UnlockVestedFunds({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const history = useHistory();

  const [error, setError] = useState<string | null>(null);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { address } = identity;

      try {
        const password = await passwordField.get(event);

        await vestChannel.get({ address, password });

        history.push(generatePath(paths.identity.overview, { address }));
      } catch (error) {
        console.error(error);
        if (error.message === insufficientFunds) {
          setError(t('view_UnlockVestedFunds_insufficient_funds'));
        }
      }
    },
    [t, identity, history, passwordField],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_UnlockVestedFunds_heading')}</h1>
      <p className={styles.subline}>{t('view_UnlockVestedFunds_subline')}</p>

      <Avatar address={identity.address} className={styles.avatar} />
      <p className={styles.name}>{identity.name}</p>

      <p className={styles.explanation}>
        {t('view_UnlockVestedFunds_explanation')}
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit}>
          {t('view_UnlockVestedFunds_CTA')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>

      <LinkBack />
      <Stats />
    </form>
  );
}
