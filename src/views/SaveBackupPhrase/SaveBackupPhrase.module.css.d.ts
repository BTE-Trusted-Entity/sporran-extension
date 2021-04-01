declare namespace SaveBackupPhraseModuleCssNamespace {
  export interface ISaveBackupPhraseModuleCss {
    buttons: string;
    cancel: string;
    container: string;
    counter: string;
    create: string;
    eye: string;
    heading: string;
    item: string;
    items: string;
    subheading: string;
    word: string;
  }
}

declare const SaveBackupPhraseModuleCssModule: SaveBackupPhraseModuleCssNamespace.ISaveBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SaveBackupPhraseModuleCssNamespace.ISaveBackupPhraseModuleCss;
};

export = SaveBackupPhraseModuleCssModule;
