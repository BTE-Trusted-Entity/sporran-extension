declare namespace ShareCredentialSignModuleCssNamespace {
  export interface IShareCredentialSignModuleCss {
    buttonsLine: string;
    cancel: string;
    container: string;
    errorTooltip: string;
    detail: string;
    detailName: string;
    details: string;
    detailsContainer: string;
    detailValue: string;
    heading: string;
    name: string;
    subline: string;
    submit: string;
  }
}

declare const ShareCredentialSignModuleCssModule: ShareCredentialSignModuleCssNamespace.IShareCredentialSignModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ShareCredentialSignModuleCssNamespace.IShareCredentialSignModuleCss;
};

export = ShareCredentialSignModuleCssModule;
