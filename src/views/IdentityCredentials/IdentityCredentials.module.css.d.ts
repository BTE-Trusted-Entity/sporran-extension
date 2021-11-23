declare namespace IdentityCredentialsModuleCssNamespace {
  export interface IIdentityCredentialsModuleCss {
    container: string;
    credentials: string;
    explainerLink: string;
    heading: string;
    info: string;
    subline: string;
  }
}

declare const IdentityCredentialsModuleCssModule: IdentityCredentialsModuleCssNamespace.IIdentityCredentialsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentityCredentialsModuleCssNamespace.IIdentityCredentialsModuleCss;
};

export = IdentityCredentialsModuleCssModule;
