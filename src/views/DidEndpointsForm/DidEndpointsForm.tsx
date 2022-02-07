import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Link, Prompt, useHistory, useParams } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils } from '@kiltprotocol/did';
import { last } from 'lodash-es';

import * as styles from './DidEndpointsForm.module.css';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import {
  getFragment,
  queryFullDetailsFromIdentifier,
} from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

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
  endpoint: IDidServiceEndpoint;
  startUrl?: string;
  onRemove: (endpoint: IDidServiceEndpoint) => void;
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

function DidNewEndpoint({
  onAdd,
  tooMany,
  startUrl,
}: {
  onAdd: (endpoint: IDidServiceEndpoint) => void;
  tooMany: boolean;
  startUrl?: string;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const params: { address: string; id: string } = useParams();
  const isAdding = params.id === 'add';

  const ref = useRef<HTMLLIElement>(null);
  useScrollEndpoint(ref, 'add');

  const [dirty, setDirty] = useState(false);
  const handleFormInput = useCallback(() => setDirty(true), []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (tooMany) {
        return;
      }

      const formData = new FormData(event.target as HTMLFormElement);
      const id = formData.get('id') as string;
      const url = formData.get('url') as string;
      const type = formData.get('type') as string;

      setDirty(false);
      // wait for React to update the dirty flag
      await new Promise((resolve) => setTimeout(resolve, 10));

      onAdd({
        id,
        urls: [url],
        types: [type],
      });
    },
    [tooMany, onAdd],
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
        <form onSubmit={handleSubmit} onInput={handleFormInput}>
          <Prompt when={dirty} message={t('view_DidEndpointsForm_unsaved')} />

          <label className={styles.label}>
            {t('view_DidEndpointsForm_url')}
            <input className={styles.input} type="url" name="url" required />
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
  onAdd: (endpoint: IDidServiceEndpoint) => void;
  onRemove: (endpoint: IDidServiceEndpoint) => void;
}

export function DidEndpointsForm({
  identity,
  onAdd,
  onRemove,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const history = useHistory();

  const { did, address } = identity;

  const [endpoints, setEndpoints] = useState<IDidServiceEndpoint[]>();
  useEffect(() => {
    (async () => {
      const { identifier } = DidUtils.parseDidUrl(did);
      const details = await queryFullDetailsFromIdentifier(identifier);
      if (!details) {
        throw new Error(`Could not resolve DID ${did}`);
      }
      setEndpoints(details.getEndpoints());
    })();
  }, [address, did, history]);

  const lastEndpoint = last(endpoints);
  const hasTooManyEndpoints = Boolean(endpoints && endpoints.length >= 25);
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
