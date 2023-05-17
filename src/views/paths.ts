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
    did: {
      upgrade: {
        start: '/identity/:address/did/upgrade',
        kilt: '/identity/:address/did/upgrade/kilt',
        euro: '/identity/:address/did/upgrade/euro',
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
          edit: '/identity/:address/did/endpoints/:id?',
          sign: '/identity/:address/did/endpoints/sign',
        },
      },
      repair: '/identity/:address/did/repair',
    },
    web3name: {
      create: {
        base: '/identity/:address/web3name/create',
        info: '/identity/:address/web3name/create/info',
        form: '/identity/:address/web3name/create/form',
        choose: '/identity/:address/web3name/create/choose/:web3name',
        kilt: '/identity/:address/web3name/create/kilt/:web3name',
        euro: '/identity/:address/web3name/create/euro/:web3name',
      },
      manage: {
        start: '/identity/:address/web3name',
        remove: '/identity/:address/web3name/remove',
      },
    },
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
    sign: '/popup/sign',
    signRaw: '/popup/signRaw',
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
