import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState, useEffect, useRef } from 'react';
import { includes, without } from 'lodash-es';
import cx from 'classnames';

import { Credential } from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { Identity } from '../../utilities/identities/types';

import { ShareInput } from '../../channels/shareChannel/types';

import { useScrollIntoView } from './CredentialCard';
import { Selected } from '../../views/ShareCredential/ShareCredential';

import * as styles from './CredentialCard.module.css';

function useRequiredProperties(credential: Credential, data: ShareInput) {
  const [requiredProperties, setRequiredProperties] = useState<string[]>([]);

  useEffect(() => {
    const { cTypes } = data.credentialRequest;

    const cType = cTypes.find(
      ({ cTypeHash }) => cTypeHash === credential.request.claim.cTypeHash,
    );
    setRequiredProperties(cType?.requiredProperties || []);
  }, [data, credential]);

  return requiredProperties;
}

interface Props {
  credential: Credential;
  identity: Identity;
  onSelect: (value: Selected) => void;
  isSelected: boolean;
}

export function ShareCredentialCard({
  credential,
  identity,
  onSelect,
  isSelected = false,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [isSelected]);

  const statuses = {
    pending: t('component_CredentialCard_pending'),
    attested: t('component_CredentialCard_attested'),
    revoked: t('component_CredentialCard_revoked'),
  };

  const contents = Object.entries(credential.request.claim.contents);

  const handleCollapse = useCallback(() => setExpanded(false), []);

  const data = usePopupData<ShareInput>();

  const [checked, setChecked] = useState<string[]>([]);

  const requiredProperties = useRequiredProperties(credential, data);

  useEffect(() => {
    setChecked(requiredProperties);
  }, [requiredProperties]);

  const isAttested = credential.status === 'attested';

  const handleSelect = useCallback(() => {
    const selected = { credential, identity, sharedProps: checked };
    onSelect(selected);
  }, [credential, onSelect, checked, identity]);

  const handleExpand = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
    }
  }, [expanded]);

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

  useScrollIntoView(expanded, cardRef, false);

  return (
    <li className={styles.selectable} aria-expanded={expanded} ref={cardRef}>
      <input
        name="credential"
        type="radio"
        id={credential.request.rootHash}
        onChange={handleSelect}
        onClick={handleExpand}
        checked={isSelected}
        className={cx(styles.select, {
          [styles.notAttested]: !isAttested,
        })}
      />

      {!expanded && (
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

      {expanded && (
        <section className={styles.shareExpanded}>
          <section className={styles.buttons}>
            <button
              type="button"
              aria-label={t('component_CredentialCard_collapse')}
              className={styles.collapse}
              onClick={handleCollapse}
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
