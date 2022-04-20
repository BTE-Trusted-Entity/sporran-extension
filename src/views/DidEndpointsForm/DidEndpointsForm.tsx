import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, Prompt, useParams } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { u32 } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { DidServiceEndpoint } from '@kiltprotocol/types';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { last } from 'lodash-es';

import * as styles from './DidEndpointsForm.module.css';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { getFragment, getFullDidDetails } from '../../utilities/did/did';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import { generatePath, paths } from '../paths';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

function useScrollEndpoint(ref: RefObject<HTMLLIElement>, id: string) {
  const params: { id: string } = useParams();

  useEffect(() => {
    if (decodeURIComponent(params.id) === id && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [id, params.id, ref]);
}

function DidEndpointCard({
  endpoint,
  startUrl,
  onRemove,
}: {
  endpoint: DidServiceEndpoint;
  startUrl?: string;
  onRemove: (endpoint: DidServiceEndpoint) => void;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const params: { id: string; address: string } = useParams();

  const handleDelete = useCallback(() => {
    onRemove(endpoint);
  }, [endpoint, onRemove]);

  const {
    types: [type],
    urls: [url],
    id,
  } = endpoint;

  const expanded = !startUrl || id === decodeURIComponent(params.id);
  const { address } = params;

  const ref = useRef<HTMLLIElement>(null);
  useScrollEndpoint(ref, endpoint.id);

  return (
    <li className={styles.endpoint} aria-expanded={expanded} ref={ref}>
      {startUrl && !expanded && (
        <Link
          className={styles.expand}
          to={generatePath(paths.identity.did.manage.endpoints.edit, {
            address,
            id,
          })}
          replace
        >
          <section className={styles.collapsedCard}>
            <h4 className={styles.collapsedUrl}>{url}</h4>
            <p className={styles.collapsedType}>{type}</p>
          </section>
        </Link>
      )}

      {expanded && (
        <section className={styles.buttons}>
          {startUrl && (
            <Link className={styles.collapse} to={startUrl} replace />
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

function apiConstToNumber(value?: Codec): number | undefined {
  return value === undefined ? undefined : (value as u32).toNumber();
}

function DidNewEndpoint({
  onAdd,
  tooMany,
  startUrl,
}: {
  onAdd: (endpoint: DidServiceEndpoint) => void;
  tooMany: boolean;
  startUrl?: string;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const params: { address: string; id: string } = useParams();
  const isAdding = params.id === 'add';

  const ref = useRef<HTMLLIElement>(null);
  useScrollEndpoint(ref, 'add');

  const dirty = useBooleanState();

  const ns = useAsyncValue(
    async () =>
      (await BlockchainApiConnection.getConnectionOrConnect()).api.consts.did,
    [],
  );
  const maxIdLength = useMemo(
    () => apiConstToNumber(ns?.maxServiceIdLength),
    [ns],
  );
  const maxTypeLength = useMemo(
    () => apiConstToNumber(ns?.maxServiceTypeLength),
    [ns],
  );
  const maxUrlLength = useMemo(
    () => apiConstToNumber(ns?.maxServiceUrlLength),
    [ns],
  );

  const [endpointIdError, setEndpointIdError] = useState('');

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setEndpointIdError('');
      if (tooMany) {
        return;
      }

      const formData = new FormData(event.target as HTMLFormElement);
      const id = (formData.get('id') as string).trim();
      const url = (formData.get('url') as string).trim();
      const type = (formData.get('type') as string).trim();

      const idHasUnsupportedCharacter = id.match(/[^a-z\d]/i);
      if (idHasUnsupportedCharacter) {
        setEndpointIdError(t('view_DidEndpointsForm_formatID'));
        return;
      }

      dirty.off();
      // wait for React to update the dirty flag
      await new Promise((resolve) => setTimeout(resolve, 10));

      onAdd({
        id,
        urls: [url],
        types: [type],
      });
    },
    [tooMany, dirty, onAdd, t],
  );

  return (
    <li
      className={styles.add}
      aria-expanded={Boolean(startUrl) && isAdding}
      ref={ref}
    >
      <Link
        className={styles.expand}
        to={generatePath(paths.identity.did.manage.endpoints.add, {
          address: params.address,
        })}
        replace
      >
        {t('view_DidEndpointsForm_add')}
      </Link>

      {isAdding && (
        <form onSubmit={handleSubmit} onInput={dirty.on}>
          <Prompt
            when={dirty.current}
            message={t('view_DidEndpointsForm_unsaved')}
          />

          <label className={styles.label}>
            {t('view_DidEndpointsForm_url')}
            <input
              className={styles.input}
              type="url"
              name="url"
              required
              maxLength={maxUrlLength}
            />
          </label>
          <label className={styles.label}>
            {t('view_DidEndpointsForm_type')}
            <input
              className={styles.input}
              name="type"
              required
              maxLength={maxTypeLength}
            />
          </label>
          <div className={styles.labelLine}>
            <label className={styles.label}>
              {t('view_DidEndpointsForm_id')}
              <input
                className={styles.input}
                name="id"
                required
                defaultValue={String(Math.random()).substring(2, 8)}
                maxLength={maxIdLength}
              />
              {endpointIdError && (
                <output className={styles.errorTooltipId}>
                  {endpointIdError}
                </output>
              )}
            </label>
          </div>

          <p className={styles.buttonsLine}>
            {startUrl && (
              <Link className={styles.cancel} to={startUrl} replace>
                {t('common_action_cancel')}
              </Link>
            )}
            <button type="submit" className={styles.submit} disabled={tooMany}>
              {t('common_action_next')}
            </button>
            {tooMany && (
              <output className={styles.errorTooltip}>
                {t('view_DidEndpointsForm_tooMany')}
              </output>
            )}
          </p>
        </form>
      )}
    </li>
  );
}

interface Props {
  identity: Identity;
  onAdd: (endpoint: DidServiceEndpoint) => void;
  onRemove: (endpoint: DidServiceEndpoint) => void;
}

export function DidEndpointsForm({
  identity,
  onAdd,
  onRemove,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did, address } = identity;

  const endpoints = useAsyncValue(
    async (did) => (await getFullDidDetails(did)).getEndpoints(),
    [did],
  );

  const maxEndpoints = useAsyncValue(async () => {
    const { api } = await BlockchainApiConnection.getConnectionOrConnect();
    return apiConstToNumber(api.consts.did.maxNumberOfServicesPerDid);
  }, []);

  const lastEndpoint = last(endpoints);
  const hasTooManyEndpoints = Boolean(
    endpoints && maxEndpoints && endpoints.length >= maxEndpoints,
  );
  const hasFewEndpoints = endpoints && endpoints.length < 7;
  const hasNoEndpoints = !endpoints || endpoints.length === 0;
  const collapsible = !hasNoEndpoints;

  const startUrl = generatePath(paths.identity.did.manage.endpoints.start, {
    address,
  });

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidEndpointsForm_heading')}</h1>
      <p className={styles.subline}>{t('view_DidEndpointsForm_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      <ul className={styles.list}>
        {!endpoints && <div className={styles.loading} />}

        {endpoints && (
          <DidNewEndpoint
            onAdd={onAdd}
            tooMany={hasTooManyEndpoints}
            startUrl={collapsible ? startUrl : undefined}
          />
        )}

        {endpoints?.map((endpoint) => (
          <DidEndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            startUrl={
              hasFewEndpoints && endpoint === lastEndpoint
                ? undefined
                : startUrl
            }
            onRemove={onRemove}
          />
        ))}
      </ul>

      {/* Use the link form because we could have been redirected to this form after submitting the transaction,
          and then going back from manage DID would end in a wrong place. */}
      <LinkBack to={paths.identity.did.manage.start} />
      <Stats />
    </section>
  );
}
