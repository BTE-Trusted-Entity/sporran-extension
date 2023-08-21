import { FormEvent, useCallback } from 'react';
import browser from 'webextension-polyfill';

import * as styles from './IdentitySlide.module.css';

import { Avatar } from '../Avatar/Avatar';
import { IdentityOptions } from '../IdentityOptions/IdentityOptions';

import { Identity, saveIdentity } from '../../utilities/identities/identities';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

interface Props {
  identity: Identity;
  options?: boolean;
}

export function IdentitySlide({ identity, options = false }: Props) {
  const t = browser.i18n.getMessage;

  const editing = useBooleanState();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const target = event.target as unknown as {
        elements: Record<string, HTMLInputElement>;
      };

      const name = target.elements.name.value;
      await saveIdentity({
        ...identity,
        name,
      });

      editing.off();
    },
    [editing, identity],
  );

  return (
    <section className={styles.container}>
      <Avatar identity={identity} />
      {!editing.current ? (
        <div className={options ? styles.nameLine : styles.centeredNameLine}>
          <span className={styles.name}>{identity.name}</span>
          {options && (
            <IdentityOptions identity={identity} onEdit={editing.on} />
          )}
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="name"
            required
            aria-label={t('component_IdentitySlide_name')}
            placeholder={t('component_IdentitySlide_name')}
            defaultValue={identity.name}
            autoComplete="off"
            autoFocus
          />
          <button
            className={styles.save}
            type="submit"
            aria-label={t('common_action_save')}
            title={t('common_action_save')}
          />
          <button
            className={styles.cancel}
            type="button"
            onClick={editing.off}
            aria-label={t('common_action_cancel')}
            title={t('common_action_cancel')}
          />
        </form>
      )}
    </section>
  );
}
