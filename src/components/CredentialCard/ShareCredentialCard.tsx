import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState, useEffect, useRef } from 'react';
import { includes, without, find } from 'lodash-es';
import cx from 'classnames';

import * as styles from './CredentialCard.module.css';

import {
  Credential,
  usePendingCredentialCheck,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { Identity } from '../../utilities/identities/types';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

import { ShareInput } from '../../channels/shareChannel/types';
import { Selected } from '../../views/ShareCredential/ShareCredential';

import { useScrollIntoView } from './CredentialCard';

const noRequiredProperties: string[] = [];

interface Props {
  credential: Credential;
  identity: Identity;
  onSelect: (value: Selected) => void;
  isSelected?: boolean;
}

export function ShareCredentialCard({
  credential,
  identity,
  onSelect,
  isSelected = false,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  usePendingCredentialCheck(credential);

  const expanded = useBooleanState();

  useEffect(() => {
    expanded.set(isSelected);
  }, [expanded, isSelected]);

  const statuses = {
    pending: t('component_CredentialCard_pending'),
    attested: t('component_CredentialCard_attested'),
    revoked: t('component_CredentialCard_revoked'),
    invalid: t('component_CredentialCard_invalid'),
  };

  const contents = Object.entries(credential.request.claim.contents);

  const data = usePopupData<ShareInput>();

  const { cTypes } = data.credentialRequest;

  const { cTypeHash } = credential.request.claim;
  const cType = find(cTypes, { cTypeHash });

  const requiredProperties = cType?.requiredProperties || noRequiredProperties;

  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(requiredProperties);
  }, [requiredProperties]);

  const isAttested = credential.status === 'attested';

  const handleSelect = useCallback(() => {
    const selected = { credential, identity, sharedProps: checked };
    onSelect(selected);
  }, [credential, onSelect, checked, identity]);

  const handlePropChecked = useCallback(
    (event) => {
      const name = event.target.name;
      if (event.target.checked && !includes(checked, name)) {
        setChecked([...checked, name]);
        onSelect({ credential, identity, sharedProps: [...checked, name] });
      } else if (!includes(requiredProperties, name)) {
        setChecked(without(checked, name));
        onSelect({ credential, identity, sharedProps: without(checked, name) });
      }
    },
    [checked, requiredProperties, credential, identity, onSelect],
  );

  const cardRef = useRef<HTMLLIElement>(null);

  useScrollIntoView(expanded.current, cardRef, false);

  return (
    <li
      className={styles.selectable}
      aria-expanded={expanded.current}
      ref={cardRef}
    >
      <input
        name="credential"
        type="radio"
        id={credential.request.rootHash}
        onChange={handleSelect}
        onClick={expanded.on}
        checked={isSelected}
        className={cx(styles.select, {
          [styles.notAttested]: !isAttested,
        })}
      />

      {!expanded.current && (
        <label className={styles.expand} htmlFor={credential.request.rootHash}>
          <section
            className={cx(styles.collapsedShareCredential, {
              [styles.notAttested]: !isAttested,
            })}
          >
            <h4 className={styles.collapsedName}>{credential.name}</h4>
            <p className={styles.collapsedValue}>{credential.attester}</p>
          </section>
        </label>
      )}

      {expanded.current && (
        <section className={styles.shareExpanded}>
          <section className={styles.buttons}>
            <button
              type="button"
              aria-label={t('component_CredentialCard_collapse')}
              className={styles.collapse}
              onClick={expanded.off}
            />
          </section>

          <section className={!isAttested ? styles.notAttested : undefined}>
            <dl className={styles.details}>
              <div className={styles.detail}>
                <dt className={styles.detailName}>
                  {t('component_CredentialCard_name')}
                </dt>
                <dd className={styles.detailValue}>{credential.name}</dd>
              </div>
              <div className={styles.detail}>
                <dt className={styles.detailName}>
                  {t('component_CredentialCard_status')}
                </dt>
                <dd className={styles.detailValue}>
                  {statuses[credential.status]}
                </dd>
              </div>

              {contents.map(([name, value]) => (
                <div key={name} className={styles.detail}>
                  <dt
                    className={cx(styles.detailName, {
                      [styles.required]: includes(requiredProperties, name),
                    })}
                  >
                    {name}
                  </dt>
                  <dd className={styles.detailValue}>
                    <label className={styles.shareLabel}>
                      <input
                        type="checkbox"
                        name={name}
                        className={styles.share}
                        checked={includes(checked, name)}
                        onChange={handlePropChecked}
                        disabled={!isAttested}
                        readOnly={includes(requiredProperties, name)}
                      />
                      <span />
                      {value}
                    </label>
                  </dd>
                </div>
              ))}
            </dl>

            {requiredProperties.length > 0 && (
              <p className={styles.requiredInfo}>
                {t('component_ShareCredentialCard_required')}
              </p>
            )}
          </section>

          <h4 className={styles.shareTechnical}>
            {t('component_CredentialCard_technical')}
          </h4>

          <dl className={styles.details}>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_ctype')}
              </dt>
              <dd className={styles.detailValue}>{credential.cTypeTitle}</dd>
            </div>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_attester')}
              </dt>
              <dd className={styles.detailValue}>{credential.attester}</dd>
            </div>
            <div className={styles.hash}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_hash')}
              </dt>
              <dd className={styles.detailValue}>
                {credential.request.rootHash}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </li>
  );
}
