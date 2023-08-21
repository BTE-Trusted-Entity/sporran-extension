import { Link, NavLink, useLocation, useRouteMatch } from 'react-router-dom';
import browser from 'webextension-polyfill';
import { sortBy } from 'lodash-es';

import * as styles from './IdentitiesCarousel.module.css';

import {
  Identity,
  isNew,
  NEW,
  useIdentities,
} from '../../utilities/identities/identities';
import { IdentitySlide } from '../IdentitySlide/IdentitySlide';
import { IdentitySlideNew } from '../IdentitySlide/IdentitySlideNew';
import { generatePath } from '../../views/paths';
import { isExtensionPopup } from '../../utilities/isExtensionPopup/isExtensionPopup';

interface IdentityLinkProps {
  identity: Identity;
  identities: Identity[];
  direction: 'previous' | 'next';
  showAdd: boolean;
}

function IdentityLink({
  identity,
  identities,
  direction,
  showAdd,
}: IdentityLinkProps) {
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
  const isNewIdentity = showAdd && !isInRange;

  const linkedIndex = (modifiedIndex + length) % length;
  const linkedIdentity = isNewIdentity ? NEW : identities[linkedIndex];
  const title = isNewIdentity
    ? t('component_IdentityLink_title_new')
    : linkedIdentity.name;

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
  showAdd: boolean;
}

export function IdentitiesBubbles({
  identities,
  showAdd,
}: IdentitiesBubblesProps) {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();
  const { search } = useLocation();

  const singleLink = !showAdd && identities.length <= 1;
  const tooManyLinks = identities.length > maxIdentityBubbles;
  if (singleLink || tooManyLinks) {
    return null; // hide the component when it makes no sense
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
      {showAdd && (
        <li className={styles.item}>
          <NavLink
            className={styles.add}
            activeClassName={styles.addActive}
            to={generatePath(path, { address: NEW.address })}
            aria-label={t('component_IdentitiesCarousel_title_new')}
            title={t('component_IdentitiesCarousel_title_new')}
          />
        </li>
      )}
    </ul>
  );
}

interface Props {
  identity: Identity;
  options?: boolean;
}

export function IdentitiesCarousel({ identity, options = false }: Props) {
  const identities = useIdentities().data;
  if (!identities) {
    return null; // storage data pending
  }

  const identitiesList = sortBy(Object.values(identities), 'index');
  const showAdd = isExtensionPopup();
  const showLinks = showAdd || identitiesList.length > 1;

  return (
    <div className={styles.container}>
      {isNew(identity) ? (
        <IdentitySlideNew />
      ) : (
        <IdentitySlide identity={identity} options={options} />
      )}

      {showLinks && (
        <IdentityLink
          direction="previous"
          identity={identity}
          identities={identitiesList}
          showAdd={showAdd}
        />
      )}

      {showLinks && (
        <IdentityLink
          direction="next"
          identity={identity}
          identities={identitiesList}
          showAdd={showAdd}
        />
      )}

      <IdentitiesBubbles identities={identitiesList} showAdd={showAdd} />
    </div>
  );
}
