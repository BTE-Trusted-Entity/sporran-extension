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
    send: {
      start: '/identity/:address/send',
      review: '/identity/:address/send/review',
      warning: '/identity/:address/send/warning',
    },
    receive: '/identity/:address/receive',
    credentials: '/identity/:address/credentials',
    remove: '/identity/:address/remove',
    vest: '/identity/:address/vest',
    did: {
      upgrade: {
        start: '/identity/:address/did/upgrade',
        sign: '/identity/:address/did/upgrade/sign',
      },
      manage: {
        start: '/identity/:address/did',
        warning: '/identity/:address/did/warning',
        downgrade: '/identity/:address/did/downgrade',
        endpoints: {
          start: '/identity/:address/did/endpoints',
          sign: '/identity/:address/did/endpoints/sign',
        },
        connect: {
          start: '/identity/:address/did/connect',
        },
      },
    },
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
    sign: '/popup/sign',
    signRaw: '/popup/signRaw',
    signDid: '/identity/:address/did/sign',
  },
};
