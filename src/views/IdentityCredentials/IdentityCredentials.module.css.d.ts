declare namespace IdentityCredentialsModuleCssNamespace {
  export interface IIdentityCredentialsModuleCss {
    container: string;
    credentials: string;
    credentialsContainer: string;
    explainerLink: string;
    heading: string;
    info: string;
    noCredentials: string;
    subline: string;
  }
}

declare const IdentityCredentialsModuleCssModule: IdentityCredentialsModuleCssNamespace.IIdentityCredentialsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentityCredentialsModuleCssNamespace.IIdentityCredentialsModuleCss;
};

export = IdentityCredentialsModuleCssModule;
