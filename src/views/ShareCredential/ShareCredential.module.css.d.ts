declare namespace ShareCredentialModuleCssNamespace {
  export interface IShareCredentialModuleCss {
    buttonsLine: string;
    cancel: string;
    checkbox: string;
    container: string;
    credentials: string;
    heading: string;
    label: string;
    password: string;
    passwordLine: string;
    subline: string;
    submit: string;
    valid: string;
  }
}

declare const ShareCredentialModuleCssModule: ShareCredentialModuleCssNamespace.IShareCredentialModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ShareCredentialModuleCssNamespace.IShareCredentialModuleCss;
};

export = ShareCredentialModuleCssModule;
