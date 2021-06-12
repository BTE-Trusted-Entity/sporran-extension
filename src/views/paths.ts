export { generatePath } from 'react-router-dom';

export const paths = {
  home: '/',
  settings: '/settings',
  access: '/access',
  account: {
    base: '/account/',
    create: {
      start: '/account/create',
      backup: '/account/create/backup',
      verify: '/account/create/verify',
      password: '/account/create/password',
    },
    import: {
      start: '/account/import',
      password: '/account/import/password',
    },

    overview: '/account/:address/:type(created|imported|pwreset)?',
    vest: {
      sign: '/account/:address/vest/sign',
      warning: '/account/:address/vest/warning',
    },
    reset: {
      start: '/account/:address/reset',
      password: '/account/:address/reset/password',
    },
    send: {
      start: '/account/:address/send',
      review: '/account/:address/send/review',
      warning: '/account/:address/send/warning',
    },
    receive: '/account/:address/receive',
    credentials: '/account/:address/credentials',
    remove: '/account/:address/remove',
  },
  popup: {
    base: '/popup',
    authorize: '/popup/authorize',
    claim: '/popup/claim',
    save: '/popup/save',
    share: '/popup/share',
    sign: '/popup/sign',
  },
};
