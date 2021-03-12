declare namespace SaveBackupPhraseModuleCssNamespace {
  export interface ISaveBackupPhraseModuleCss {
    item: string;
    items: string;
    radio: string;
    word: string;
  }
}

declare const SaveBackupPhraseModuleCssModule: SaveBackupPhraseModuleCssNamespace.ISaveBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SaveBackupPhraseModuleCssNamespace.ISaveBackupPhraseModuleCss;
};

export = SaveBackupPhraseModuleCssModule;
