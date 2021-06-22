declare namespace IdentityCredentialsModuleCssNamespace {
  export interface IIdentityCredentialsModuleCss {
    close: string;
    container: string;
    credentials: string;
    heading: string;
    subline: string;
    valid: string;
  }
}

declare const IdentityCredentialsModuleCssModule: IdentityCredentialsModuleCssNamespace.IIdentityCredentialsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentityCredentialsModuleCssNamespace.IIdentityCredentialsModuleCss;
};

export = IdentityCredentialsModuleCssModule;
