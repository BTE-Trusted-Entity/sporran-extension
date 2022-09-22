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
  },
  popup: {
    base: '/popup',
    import: '/popup/import',
    access: '/popup/access',
    claim: '/identity/:address/claim',
    save: '/popup/save',
    share: {
      start: '/popup/share',
      sign: '/popup/share/sign',
    },
    createDid: '/identity/:address/did/create',
  },
};
