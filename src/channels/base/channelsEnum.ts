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
  reject: 'reject' as PopupAction,
  share: 'share' as PopupAction,
  sign: 'sign' as PopupAction,
  signDid: 'signDid' as PopupAction,
  signRaw: 'signRaw' as PopupAction,
  signDidExtrinsic: 'signDidExtrinsic' as PopupAction,
  createDid: 'createDid' as PopupAction,
};
