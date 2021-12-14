declare namespace SaveCredentialModuleCssNamespace {
  export interface ISaveCredentialModuleCss {
    cardContainer: string;
    close: string;
    container: string;
    download: string;
    downloaded: string;
    done: string;
    heading: string;
    warning: string;
  }
}

declare const SaveCredentialModuleCssModule: SaveCredentialModuleCssNamespace.ISaveCredentialModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SaveCredentialModuleCssNamespace.ISaveCredentialModuleCss;
};

export = SaveCredentialModuleCssModule;
