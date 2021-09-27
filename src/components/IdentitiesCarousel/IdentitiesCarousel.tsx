import { Link, NavLink, useLocation, useRouteMatch } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { sortBy } from 'lodash-es';

import {
  Identity,
  isNew,
  NEW,
  useIdentities,
} from '../../utilities/identities/identities';
import { IdentitySlide } from '../IdentitySlide/IdentitySlide';
import { IdentitySlideNew } from '../IdentitySlide/IdentitySlideNew';
import { generatePath } from '../../views/paths';

import styles from './IdentitiesCarousel.module.css';

interface IdentityLinkProps {
  identity: Identity;
  identities: Identity[];
  direction: 'previous' | 'next';
}

function IdentityLink({
  identity,
  identities,
  direction,
}: IdentityLinkProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const { search } = useLocation();

  const { length } = identities;

  const isPrevious = direction === 'previous';
  const delta = isPrevious ? -1 : 1;
  const modifiedIndex = !isNew(identity)
    ? identities.indexOf(identity) + delta
    : isPrevious
    ? length - 1
    : 0;

  const isInRange = 0 <= modifiedIndex && modifiedIndex < length;

  const linkedIndex = (modifiedIndex + length) % length;
  const linkedIdentity = isInRange ? identities[linkedIndex] : NEW;
  const title = isInRange
    ? linkedIdentity.name
    : t('component_IdentityLink_title_new');

  return (
    <Link
      to={generatePath(`${path}${search}`, { address: linkedIdentity.address })}
      title={title}
      aria-label={title}
      className={isPrevious ? styles.left : styles.right}
      replace
    />
  );
}

const maxIdentityBubbles = 5;

interface IdentitiesBubblesProps {
  identities: Identity[];
}

export function IdentitiesBubbles({
  identities,
}: IdentitiesBubblesProps): JSX.Element | null {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const { search } = useLocation();

  if (identities.length > maxIdentityBubbles) {
    return null; // hide the component when too many identities
  }

  return (
    <ul className={styles.bubbles}>
      {identities.map(({ name, address }) => (
        <li className={styles.item} key={address}>
          <NavLink
            className={styles.bubble}
            activeClassName={styles.bubbleActive}
            to={generatePath(`${path}${search}`, { address: address })}
            aria-label={name}
            title={name}
          />
        </li>
      ))}
      <li className={styles.item}>
        <NavLink
          className={styles.add}
          activeClassName={styles.addActive}
          to={generatePath(path, { address: NEW.address })}
          aria-label={t('component_IdentitiesCarousel_title_new')}
          title={t('component_IdentitiesCarousel_title_new')}
        />
      </li>
    </ul>
  );
}

interface Props {
  identity: Identity;
  options?: boolean;
}

export function IdentitiesCarousel({
  identity,
  options,
}: Props): JSX.Element | null {
  const identities = useIdentities().data;
  if (!identities) {
    return null; // storage data pending
  }

  const identitiesList = sortBy(Object.values(identities), 'index');

  return (
    <div className={styles.container}>
      {isNew(identity) ? (
        <IdentitySlideNew />
      ) : (
        <IdentitySlide identity={identity} options={options} />
      )}

      <IdentityLink
        direction="previous"
        identity={identity}
        identities={identitiesList}
      />

      <IdentityLink
        direction="next"
        identity={identity}
        identities={identitiesList}
      />

      <IdentitiesBubbles identities={identitiesList} />
    </div>
  );
}
