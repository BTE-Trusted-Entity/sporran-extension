declare namespace AccountCredentialsModuleCssNamespace {
  export interface IAccountCredentialsModuleCss {
    close: string;
    container: string;
    credentials: string;
    heading: string;
    subline: string;
    valid: string;
  }
}

declare const AccountCredentialsModuleCssModule: AccountCredentialsModuleCssNamespace.IAccountCredentialsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountCredentialsModuleCssNamespace.IAccountCredentialsModuleCss;
};

export = AccountCredentialsModuleCssModule;
