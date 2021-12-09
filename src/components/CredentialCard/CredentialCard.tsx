import { useState, useCallback, useRef, useEffect, RefObject } from 'react';
import { browser } from 'webextension-polyfill-ts';

import {
  Credential,
  getCredentialDownload,
  saveCredential,
} from '../../utilities/credentials/credentials';

import * as styles from './CredentialCard.module.css';

function useScrollIntoView(
  expanded: boolean,
  cardRef: RefObject<HTMLLIElement>,
) {
  useEffect(() => {
    const listElement = cardRef.current?.parentElement;

    if (expanded && cardRef.current && listElement) {
      const card = cardRef.current.getBoundingClientRect();
      const list = listElement.getBoundingClientRect();

      const isCardOverflowing = card.bottom > list.bottom;

      if (!isCardOverflowing) {
        return;
      }

      if (card.height < list.height) {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [expanded, cardRef]);
}

function CredentialName({
  credential,
}: {
  credential: Credential;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      event.target.blur();
    }
  }, []);

  const handleBlur = useCallback(
    async (event) => {
      const name = event.target.value;
      if (name) {
        await saveCredential({ ...credential, name });
      }
      setIsEditing(false);
    },
    [credential],
  );

  return isEditing ? (
    <div className={styles.detail}>
      <label className={styles.detailName}>
        {t('component_CredentialCard_name')}
        <input
          defaultValue={credential.name}
          autoFocus
          className={styles.input}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
        />
      </label>
    </div>
  ) : (
    <div className={styles.detail}>
      <dt className={styles.detailName}>
        {t('component_CredentialCard_name')}
      </dt>
      <dd className={styles.nameValue}>
        {credential.name}
        <button
          className={styles.editName}
          aria-label={t('component_CredentialCard_edit_name')}
          onClick={handleEditClick}
        />
      </dd>
    </div>
  );
}

interface Props {
  credential: Credential;
  expand?: boolean;
}

export function CredentialCard({
  credential,
  expand = false,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const statuses = {
    pending: t('component_CredentialCard_pending'),
    attested: t('component_CredentialCard_attested'),
    revoked: t('component_CredentialCard_revoked'),
  };

  const { status } = credential;

  const [expanded, setExpanded] = useState(expand);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);
  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  const contents = Object.entries(credential.request.claim.contents);

  const download = getCredentialDownload(credential);

  const cardRef = useRef<HTMLLIElement>(null);

  useScrollIntoView(expanded, cardRef);

  return (
    <li className={styles.credential} aria-expanded={expanded} ref={cardRef}>
      {!expanded && (
        <button type="button" className={styles.expand} onClick={handleExpand}>
          <section className={styles.collapsedCredential}>
            <h4 className={styles.collapsedName}>{credential.name}</h4>
            <p className={styles.collapsedFirstProp}>{contents[0][1]}</p>
          </section>
        </button>
      )}

      {expanded && (
        <section className={styles.expanded}>
          <section className={styles.buttons}>
            <button
              type="button"
              aria-label={t('component_CredentialCard_collapse')}
              className={styles.collapse}
              onClick={handleCollapse}
            />
            <a
              download={download.name}
              href={download.url}
              aria-label={t('component_CredentialCard_backup')}
              className={styles.backup}
            />
            {/*<button
              type="button"
              aria-label={t('component_CredentialCard_remove')}
              className={styles.remove}
              // TODO: https://kiltprotocol.atlassian.net/browse/SK-589
            />*/}
          </section>

          <dl className={styles.details}>
            <CredentialName credential={credential} />

            <div className={styles.detail}>
              <dt className={styles.detailName}>
                {t('component_CredentialCard_status')}
              </dt>
              <dd className={styles.detailValue}>{statuses[status]}</dd>
            </div>

            {contents.map(([name, value]) => (
              <div key={name} className={styles.detail}>
                <dt className={styles.detailName}>{name}</dt>
                <dd className={styles.detailValue}>{value}</dd>
              </div>
            ))}
          </dl>

          <h4 className={styles.technical}>
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
