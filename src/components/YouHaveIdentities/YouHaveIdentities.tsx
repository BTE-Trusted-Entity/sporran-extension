import { Fragment, JSX } from 'react';

import { useIdentities } from '../../utilities/identities/identities';
import { plural } from '../../utilities/plural/plural';

export function YouHaveIdentities(): JSX.Element | null {
  const identities = useIdentities().data;
  if (!identities) {
    // empty string to force rendering of the containing component and prevent layout shift
    return <Fragment> </Fragment>; // storage data pending
  }

  const identitiesNumber = Object.values(identities).length;

  return (
    <Fragment>
      {plural(identitiesNumber, {
        one: 'component_YouHaveIdentities_one',
        other: 'component_YouHaveIdentities_other',
      })}
    </Fragment>
  );
}
