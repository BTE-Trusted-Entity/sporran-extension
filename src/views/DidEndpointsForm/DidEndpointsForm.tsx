import { useCallback, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils } from '@kiltprotocol/did';
import { last } from 'lodash-es';
import { useHistory } from 'react-router-dom';

import * as styles from './DidEndpointsForm.module.css';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import {
  getFragment,
  queryFullDetailsFromIdentifier,
} from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

function DidEndpointCard({
  endpoint,
  collapsible,
  onRemove,
}: {
  endpoint: IDidServiceEndpoint;
  collapsible: boolean;
  onRemove: (endpoint: IDidServiceEndpoint) => void;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const [expanded, setExpanded] = useState(!collapsible);

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const handleDelete = useCallback(() => {
    onRemove(endpoint);
  }, [endpoint, onRemove]);

  const {
    types: [type],
    urls: [url],
    id,
  } = endpoint;

  return (
    <li className={styles.endpoint} aria-expanded={expanded}>
      {collapsible && !expanded && (
        <button type="button" className={styles.expand} onClick={toggleExpand}>
          <section className={styles.collapsedCard}>
            <h4 className={styles.collapsedUrl}>{url}</h4>
            <p className={styles.collapsedType}>{type}</p>
          </section>
        </button>
      )}

      {expanded && (
        <section className={styles.buttons}>
          {collapsible && (
            <button
              type="button"
              className={styles.collapse}
              onClick={toggleExpand}
            />
          )}
          <button
            type="button"
            className={styles.remove}
            onClick={handleDelete}
          />
        </section>
      )}

      {expanded && (
        <dl>
          <dt className={styles.name}>{t('view_DidEndpointsForm_url')}</dt>
          <dd className={styles.value}>{url}</dd>
          <dt className={styles.name}>{t('view_DidEndpointsForm_type')}</dt>
          <dd className={styles.value}>{type}</dd>
          <dt className={styles.name}>{t('view_DidEndpointsForm_id')}</dt>
          <dd className={styles.value}>{getFragment(id)}</dd>
        </dl>
      )}
    </li>
  );
}

interface Props {
  identity: Identity;
  onAdd: (endpoint: IDidServiceEndpoint) => void;
  onRemove: (endpoint: IDidServiceEndpoint) => void;
}

export function DidEndpointsForm({
  identity,
  onAdd,
  onRemove,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { did, address } = identity;

  const [endpoints, setEndpoints] = useState<IDidServiceEndpoint[]>();
  useEffect(() => {
    (async () => {
      const { identifier } = DidUtils.parseDidUrl(did);
      const details = await queryFullDetailsFromIdentifier(identifier);
      if (!details) {
        throw new Error(`Could not resolve DID ${did}`);
      }
      const loadedEndpoints = details.getEndpoints();
      setEndpoints(loadedEndpoints);

      if (loadedEndpoints.length > 0) {
        setExpanded(false);
      }
    })();
  }, [did]);

  const lastEndpoint = last(endpoints);
  const hasTooManyEndpoints = endpoints && endpoints.length >= 25;
  const hasFewEndpoints = endpoints && endpoints.length < 7;
  const hasNoEndpoints = !endpoints || endpoints.length === 0;
  const collapsible = !hasNoEndpoints;
  const [expanded, setExpanded] = useState(hasNoEndpoints);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);
  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      if (hasTooManyEndpoints) {
        return;
      }

      const formData = new FormData(event.target as HTMLFormElement);
      const id = formData.get('id') as string;
      const url = formData.get('url') as string;
      const type = formData.get('type') as string;

      onAdd({
        id,
        urls: [url],
        types: [type],
      });
    },
    [hasTooManyEndpoints, onAdd],
  );

  const history = useHistory();
  const handleLinkBackClick = useCallback(() => {
    // Pretend we have been on the identity overview page before the manage DID page,
    // because we could have been redirected to this form from submitting the transaction,
    // and then going back from manage DID would end in a wrong place.
    history.push(generatePath(paths.identity.overview, { address }));
    history.push(generatePath(paths.identity.did.manage, { address }));
  }, [address, history]);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidEndpointsForm_heading')}</h1>
      <p className={styles.subline}>{t('view_DidEndpointsForm_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      <ul className={styles.list}>
        {!endpoints && <div className={styles.loading} />}

        {endpoints && (
          <li className={styles.add} aria-expanded={expanded}>
            <button
              type="button"
              className={styles.expand}
              onClick={handleExpand}
            >
              {t('view_DidEndpointsForm_add')}
            </button>

            {expanded && (
              <form onSubmit={handleSubmit}>
                <label className={styles.label}>
                  {t('view_DidEndpointsForm_url')}
                  <input
                    className={styles.input}
                    type="url"
                    name="url"
                    required
                  />
                </label>
                <label className={styles.label}>
                  {t('view_DidEndpointsForm_type')}
                  <input className={styles.input} name="type" required />
                </label>
                <label className={styles.label}>
                  {t('view_DidEndpointsForm_id')}
                  <input
                    className={styles.input}
                    name="id"
                    required
                    defaultValue={String(Math.random()).substring(2, 8)}
                  />
                </label>
                <p className={styles.buttonsLine}>
                  {collapsible && (
                    <button
                      type="button"
                      className={styles.cancel}
                      onClick={handleCollapse}
                    >
                      {t('common_action_cancel')}
                    </button>
                  )}
                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={hasTooManyEndpoints}
                  >
                    {t('common_action_next')}
                  </button>
                  {hasTooManyEndpoints && (
                    <output className={styles.errorTooltip}>
                      {t('view_DidEndpointsForm_tooMany')}
                    </output>
                  )}
                </p>
              </form>
            )}
          </li>
        )}

        {endpoints?.map((endpoint) => (
          <DidEndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            collapsible={!(hasFewEndpoints && endpoint === lastEndpoint)}
            onRemove={onRemove}
          />
        ))}
      </ul>

      <button
        title={t('common_action_back')}
        aria-label={t('common_action_back')}
        onClick={handleLinkBackClick}
        className={styles.linkBack}
      />
      <Stats />
    </section>
  );
}
