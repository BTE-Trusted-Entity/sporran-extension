declare namespace ShareCredentialSelectModuleCssNamespace {
  export interface IShareCredentialSelectModuleCss {
    allCredentials: string;
    avatar: string;
    buttonsLine: string;
    cancel: string;
    container: string;
    heading: string;
    identity: string;
    identityLine: string;
    identityCredentials: string;
    info: string;
    explainerLink: string;
    list: string;
    next: string;
    noCredentials: string;
    subline: string;
  }
}

declare const ShareCredentialSelectModuleCssModule: ShareCredentialSelectModuleCssNamespace.IShareCredentialSelectModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ShareCredentialSelectModuleCssNamespace.IShareCredentialSelectModuleCss;
};

export = ShareCredentialSelectModuleCssModule;
