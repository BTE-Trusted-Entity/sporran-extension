export { generatePath } from 'react-router-dom';

export const paths = {
  home: '/',
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
    reset: {
      start: '/account/:address/reset',
      password: '/account/:address/reset/password',
    },
    send: {
      start: '/account/:address/send',
      review: '/account/:address/send/review',
    },
    receive: '/account/:address/receive',
    credentials: '/account/:address/credentials',
    remove: '/account/:address/remove',
  },
  popup: {
    base: '/popup',
    claim: '/popup/claim',
    save: '/popup/save',
    share: '/popup/share',
  },
};
