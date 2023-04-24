import { browser } from 'webextension-polyfill-ts';
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  RefObject,
  ChangeEvent,
} from 'react';
import { includes, without, find } from 'lodash-es';
import cx from 'classnames';

import * as styles from './CredentialCard.module.css';

import {
  SporranCredential,
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
  sporranCredential: SporranCredential;
  identity: Identity;
  onSelect: (value: Selected) => void;
  viewRef: RefObject<HTMLElement>;
  isSelected?: boolean;
  expand: boolean;
}

export function ShareCredentialCard({
  sporranCredential,
  identity,
  onSelect,
  viewRef,
  isSelected = false,
  expand,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  usePendingCredentialCheck(sporranCredential);

  const expanded = useBooleanState();

  useEffect(() => {
    expanded.set(isSelected);
  }, [expanded, isSelected, expand]);

  const statuses = {
    pending: t('component_CredentialCard_pending'),
    attested: t('component_CredentialCard_attested'),
    revoked: t('component_CredentialCard_revoked'),
    invalid: t('component_CredentialCard_invalid'),
  };

  const { credential, name, attester, cTypeTitle, status } = sporranCredential;
  const contents = Object.entries(credential.claim.contents);

  const data = usePopupData<ShareInput>();

  const { cTypes } = data.credentialRequest;

  const { cTypeHash } = credential.claim;
  const cType = find(cTypes, { cTypeHash });

  const requiredProperties = cType?.requiredProperties || noRequiredProperties;

  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    setChecked(requiredProperties);
  }, [requiredProperties]);

  useEffect(() => {
    if (expand) {
      onSelect({ sporranCredential, identity, sharedContents: checked });
    }
  }, [expand, onSelect, checked, sporranCredential, identity]);

  const isShareable = ['attested', 'revoked'].includes(status);

  const handleSelect = useCallback(() => {
    const selected = { sporranCredential, identity, sharedContents: checked };
    onSelect(selected);
  }, [sporranCredential, identity, checked, onSelect]);

  const handlePropChecked = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      if (event.target.checked && !includes(checked, name)) {
        setChecked([...checked, name]);
        onSelect({
          sporranCredential,
          identity,
          sharedContents: [...checked, name],
        });
      } else if (!includes(requiredProperties, name)) {
        setChecked(without(checked, name));
        onSelect({
          sporranCredential,
          identity,
          sharedContents: without(checked, name),
        });
      }
    },
    [checked, requiredProperties, sporranCredential, identity, onSelect],
  );

  const cardRef = useRef<HTMLLIElement>(null);

  useScrollIntoView(expanded.current, cardRef, viewRef);

  return (
    <li
      className={styles.selectable}
      aria-expanded={expanded.current}
      ref={cardRef}
    >
      <input
        name="credential"
        type="radio"
        id={credential.rootHash}
        onChange={handleSelect}
        onClick={expanded.on}
        checked={isSelected}
        className={cx(styles.selectOne, {
          [styles.notUsable]: !isShareable,
        })}
      />

      {!expanded.current && (
        <label className={styles.expand} htmlFor={credential.rootHash}>
          <section
            className={cx(styles.collapsedShareCredential, {
              [styles.notUsable]: !isShareable,
            })}
          >
            <h4 className={styles.collapsedName}>{name}</h4>
            <p className={styles.collapsedValue}>{attester}</p>
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

          <section className={!isShareable ? styles.notUsable : undefined}>
            <dl className={styles.details}>
              <div className={styles.detail}>
                <dt className={styles.detailName}>
                  {t('component_CredentialCard_name')}
                </dt>
                <dd className={styles.detailValue}>{name}</dd>
              </div>
              <div className={styles.detail}>
                <dt className={styles.detailName}>
                  {t('component_CredentialCard_status')}
                </dt>
                <dd className={styles.detailValue}>{statuses[status]}</dd>
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
                        disabled={!isShareable}
                        readOnly={includes(requiredProperties, name)}
                      />
                      <span />
                      {String(value)}
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
              <dd className={styles.detailValue}>{cTypeTitle}</dd>
            </div>
            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_attester')}
              </dt>
              <dd className={styles.detailValue}>{attester}</dd>
            </div>
            <div className={styles.hash}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_hash')}
              </dt>
              <dd className={styles.detailValue}>{credential.rootHash}</dd>
            </div>
          </dl>
        </section>
      )}
    </li>
  );
}
