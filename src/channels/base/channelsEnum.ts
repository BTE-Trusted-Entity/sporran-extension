import { PopupAction } from '../../utilities/popups/types';

export const channelsEnum = {
  challenge: 'challenge',
  credential: 'credential',
  forgetAllPasswords: 'forgetAllPasswords',
  forgetPassword: 'forgetPassword',
  hasSavedPasswords: 'hasSavedPasswords',
  identities: 'identities',
  genesisHash: 'genesisHash',
  getPassword: 'getPassword',
  savePassword: 'savePassword',
  toggleIcons: 'toggleIcons',
};

export const popupsEnum = {
  access: 'access' as PopupAction,
  claim: 'claim' as PopupAction,
  save: 'save' as PopupAction,
  share: 'share' as PopupAction,
  signDid: 'signDid' as PopupAction,
  signDidExtrinsic: 'signDidExtrinsic' as PopupAction,
  createDid: 'createDid' as PopupAction,
  ASUserData: 'ASUserData' as PopupAction,
};
