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
    reset: {
      start: '/account/:address/reset',
      password: '/account/:address/reset/password',
      overview: '/account/:address/reset/overview',
    },
    overview: '/account/:address',
    send: '/account/:address/send',
    receive: '/account/:address/receive',
    remove: '/account/:address/remove',
    created: '/account/:address/created',
    imported: '/account/:address/imported',
    reseted: '/account/:address/reseted',
  },
};
