declare namespace SaveCredentialModuleCssNamespace {
  export interface ISaveCredentialModuleCss {
    buttonsLine: string;
    cancel: string;
    container: string;
    detailName: string;
    detailOwnValue: string;
    detailValue: string;
    details: string;
    heading: string;
    subline: string;
    submit: string;
    warning: string;
  }
}

declare const SaveCredentialModuleCssModule: SaveCredentialModuleCssNamespace.ISaveCredentialModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SaveCredentialModuleCssNamespace.ISaveCredentialModuleCss;
};

export = SaveCredentialModuleCssModule;
