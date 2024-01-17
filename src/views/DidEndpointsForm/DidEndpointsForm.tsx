import {
  KiltPublishedCredentialCollectionV1Type,
  type Service,
} from '@kiltprotocol/types';

import {
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, Prompt, Redirect, useParams } from 'react-router-dom';
import browser from 'webextension-polyfill';
import { stringToU8a } from '@polkadot/util';
import { last } from 'lodash-es';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { serviceToChain } from '@kiltprotocol/did';

import * as styles from './DidEndpointsForm.module.css';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { useFullDidDocument } from '../../utilities/did/did';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import { generatePath, paths } from '../paths';
import { getIdentityDid } from '../../utilities/identities/identities';

function useScrollEndpoint(ref: RefObject<HTMLLIElement>, id: string) {
  const params: { id: string } = useParams();

  useEffect(() => {
    if (decodeURIComponent(params.id) === id && ref.current) {
      ref.current.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    }
  }, [id, params.id, ref]);
}

function DidEndpointCard({
  endpoint,
  startUrl,
  onRemove,
}: {
  endpoint: Service;
  startUrl?: string;
  onRemove: (endpoint: Service) => void;
}) {
  const t = browser.i18n.getMessage;

  const params: { id: string; address: string } = useParams();

  const handleDelete = useCallback(() => {
    onRemove(endpoint);
  }, [endpoint, onRemove]);

  const {
    type: [type],
    serviceEndpoint: [url],
  } = endpoint;
  const { id } = serviceToChain(endpoint);

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
          <dd className={styles.value}>{id}</dd>
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
  onAdd: (endpoint: Service) => void;
  tooMany: boolean;
  startUrl?: string;
}) {
  const t = browser.i18n.getMessage;

  const params: { address: string; id: string } = useParams();
  const isAdding = params.id === 'add';

  const ref = useRef<HTMLLIElement>(null);
  useScrollEndpoint(ref, 'add');

  const dirty = useBooleanState();

  const namespace = ConfigService.get('api').consts.did;
  const maxIdLength = namespace.maxServiceIdLength.toNumber();
  const maxTypeLength = namespace.maxServiceTypeLength.toNumber();
  const maxUrlLength = namespace.maxServiceUrlLength.toNumber();

  const [endpointIdError, setEndpointIdError] = useState('');
  const [endpointUrlError, setEndpointUrlError] = useState('');
  const [endpointTypeError, setEndpointTypeError] = useState('');

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setEndpointIdError('');
      setEndpointUrlError('');
      setEndpointTypeError('');

      if (tooMany) {
        return;
      }

      const formData = new FormData(event.currentTarget);
      const id = (formData.get('id') as string).trim();
      const url = (formData.get('url') as string).trim();
      const type = (formData.get('type') as string).trim();

      // allow all characters valid in the URI fragment except for %
      const unsupportedCharacter = id.match(/[^a-z0-9\-._~!$&'()*+=,;:@?/]/i);
      if (unsupportedCharacter) {
        setEndpointIdError(
          t('view_DidEndpointsForm_formatID', unsupportedCharacter),
        );
        return;
      }

      const idBytes = stringToU8a(id).length;
      if (maxIdLength && idBytes > maxIdLength) {
        setEndpointIdError(
          t('view_DidEndpointsForm_tooLong', [
            String(idBytes),
            String(maxIdLength),
          ]),
        );
        return;
      }

      const urlBytes = stringToU8a(url).length;
      if (maxUrlLength && urlBytes > maxUrlLength) {
        setEndpointUrlError(
          t('view_DidEndpointsForm_tooLong', [
            String(urlBytes),
            String(maxUrlLength),
          ]),
        );
        return;
      }

      const typeBytes = stringToU8a(type).length;
      if (maxTypeLength && typeBytes > maxTypeLength) {
        setEndpointTypeError(
          t('view_DidEndpointsForm_tooLong', [
            String(typeBytes),
            String(maxTypeLength),
          ]),
        );
        return;
      }

      dirty.off();
      // wait for React to update the dirty flag
      await new Promise((resolve) => setTimeout(resolve, 10));

      onAdd({
        id: `#${id}`,
        serviceEndpoint: [url],
        type: [type],
      });
    },
    [tooMany, maxIdLength, maxTypeLength, maxUrlLength, dirty, onAdd, t],
  );

  const isCollapsible = Boolean(startUrl);

  return (
    <li className={styles.add} aria-expanded={isAdding} ref={ref}>
      {!isCollapsible && (
        <h2 className={styles.cardHeading}>{t('view_DidEndpointsForm_add')}</h2>
      )}

      {isCollapsible && startUrl && (
        <Link
          className={isAdding ? styles.addCollapse : styles.expand}
          to={
            isAdding
              ? startUrl
              : generatePath(paths.identity.did.manage.endpoints.edit, {
                  address: params.address,
                  id: 'add',
                })
          }
          replace
        >
          {t('view_DidEndpointsForm_add')}
        </Link>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} onInput={dirty.on}>
          <Prompt
            when={dirty.current}
            message={t('view_DidEndpointsForm_unsaved')}
          />

          <div className={styles.labelLine}>
            <label className={styles.label}>
              {t('view_DidEndpointsForm_url')}
              <input className={styles.input} type="url" name="url" required />
            </label>
            {endpointUrlError && (
              <output className={styles.errorTooltipField}>
                {endpointUrlError}
              </output>
            )}
          </div>

          <div className={styles.labelLine}>
            <label className={styles.label}>
              {t('view_DidEndpointsForm_type')}
              <datalist id="types">
                <option value={KiltPublishedCredentialCollectionV1Type} />
              </datalist>
              <input
                className={styles.input}
                name="type"
                list="types"
                required
              />
            </label>
            {endpointTypeError && (
              <output className={styles.errorTooltipField}>
                {endpointTypeError}
              </output>
            )}
          </div>

          <div className={styles.labelLine}>
            <label className={styles.label}>
              {t('view_DidEndpointsForm_id')}
              <input
                className={styles.input}
                name="id"
                required
                defaultValue={String(Math.random()).substring(2, 8)}
              />
              {endpointIdError && (
                <output className={styles.errorTooltipField}>
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
  onAdd: (endpoint: Service) => void;
  onRemove: (endpoint: Service) => void;
}

export function DidEndpointsForm({ identity, onAdd, onRemove }: Props) {
  const t = browser.i18n.getMessage;

  const { address } = identity;
  const did = getIdentityDid(identity);

  const document = useFullDidDocument(did);

  const params: { id: string } = useParams();

  if (!document) {
    return <div className={styles.loading} />;
  }

  const endpoints = document.service || [];

  const api = ConfigService.get('api');
  const maxEndpoints = api.consts.did.maxNumberOfServicesPerDid.toNumber();

  const lastEndpoint = last(endpoints);
  const hasTooManyEndpoints = Boolean(endpoints.length >= maxEndpoints);
  const hasFewEndpoints = endpoints.length < 7;
  const hasNoEndpoints = endpoints.length === 0;
  const collapsible = !hasNoEndpoints;

  if (hasNoEndpoints && params.id !== 'add') {
    return (
      <Redirect
        to={generatePath(paths.identity.did.manage.endpoints.edit, {
          address,
          id: 'add',
        })}
      />
    );
  }

  const startUrl = generatePath(paths.identity.did.manage.endpoints.start, {
    address,
  });

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidEndpointsForm_heading')}</h1>
      <p className={styles.subline}>{t('view_DidEndpointsForm_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={did} label="DID" className={styles.didLine} />

      <ul className={styles.list}>
        <DidNewEndpoint
          onAdd={onAdd}
          tooMany={hasTooManyEndpoints}
          startUrl={collapsible ? startUrl : undefined}
        />

        {endpoints.map((endpoint) => (
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
