export { generatePath } from 'react-router-dom';

export const paths = {
  home: '/',
  settings: '/settings',
  access: '/access',
  identity: {
    base: '/identity/',
    add: '/identity/add',
    create: {
      start: '/identity/create',
      backup: '/identity/create/backup',
      verify: '/identity/create/verify',
      password: '/identity/create/password',
    },
    import: {
      start: '/identity/import',
      password: '/identity/import/password',
    },

    overview: '/identity/:address/:type(created|imported|pwreset)?',
    reset: {
      start: '/identity/:address/reset',
      password: '/identity/:address/reset/password',
    },
    remove: '/identity/:address/remove',
    upgradeDid: '/identity/:address/upgradeDid',
  },
  popup: {
    base: '/popup',
    import: '/popup/import',
    access: '/popup/access',
    claim: '/identity/:address/claim',
    save: '/popup/save',
    reject: '/popup/reject',
    share: {
      start: '/popup/share',
      sign: '/popup/share/sign',
    },
    signDid: {
      start: '/identity/:address/did/sign',
      sign: '/identity/:address/did/sign/password',
      credentials: '/identity/:address/did/sign/credentials',
    },
    signDidExtrinsic: '/identity/:address/did/signExtrinsic',
    createDid: '/identity/:address/did/create',
    shareIdentities: '/popup/getDidList',
  },
};
