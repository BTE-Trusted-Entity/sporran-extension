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
      success: '/account/create/success',
    },
    import: {
      start: '/account/import',
      password: '/account/import/password',
      success: '/account/import/success',
    },
    overview: '/account/:address',
    send: '/account/:address/send',
    receive: '/account/:address/receive',
  },
};
