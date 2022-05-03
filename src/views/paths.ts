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
    credentials: {
      base: '/identity/:address/credentials',
      presentation: '/identity/:address/credentials/:hash/presentation',
    },
    remove: '/identity/:address/remove',
    vest: '/identity/:address/vest',
    did: {
      upgrade: {
        start: '/identity/:address/did/upgrade',
        sign: '/identity/:address/did/upgrade/sign',
        promo: '/identity/:address/did/upgrade/promo',
      },
      manage: {
        start: '/identity/:address/did',
        downgrade: {
          base: '/identity/:address/did/downgrade',
          warning: {
            web3name: '/identity/:address/did/downgrade/warning/web3name',
            credentials: '/identity/:address/did/downgrade/warning/credentials',
          },
          sign: '/identity/:address/did/downgrade/sign',
        },
        endpoints: {
          start: '/identity/:address/did/endpoints',
          add: '/identity/:address/did/endpoints/add',
          edit: '/identity/:address/did/endpoints/:id?',
          sign: '/identity/:address/did/endpoints/sign',
        },
      },
      web3name: {
        create: {
          base: '/identity/:address/did/web3name/create',
          info: '/identity/:address/did/web3name/create/info',
          form: '/identity/:address/did/web3name/create/form',
          sign: '/identity/:address/did/web3name/create/sign/:web3name',
          promo: {
            form: '/identity/:address/did/web3name/create/promo/form',
            sign: '/identity/:address/did/web3name/create/promo/sign/:web3name',
          },
        },
        remove: '/identity/:address/did/web3name/remove',
      },
      repair: '/identity/:address/did/repair',
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
    addEndpoint: '/identity/:address/did/signExtrinsic/addEndpoint',
    removeEndpoint: '/identity/:address/did/signExtrinsic/removeEndpoint',
    signDidExtrinsic: '/identity/:address/did/signExtrinsic',
  },
};
