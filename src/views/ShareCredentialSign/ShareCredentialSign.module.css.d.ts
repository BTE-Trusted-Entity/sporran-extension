declare namespace ShareCredentialSignModuleCssNamespace {
  export interface IShareCredentialSignModuleCss {
    buttonsLine: string;
    cancel: string;
    errorTooltip: string;
    submit: string;
  }
}

declare const ShareCredentialSignModuleCssModule: ShareCredentialSignModuleCssNamespace.IShareCredentialSignModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ShareCredentialSignModuleCssNamespace.IShareCredentialSignModuleCss;
};

export = ShareCredentialSignModuleCssModule;
