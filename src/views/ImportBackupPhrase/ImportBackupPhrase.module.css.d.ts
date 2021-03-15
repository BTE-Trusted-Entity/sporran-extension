declare namespace ImportBackupPhraseModuleCssNamespace {
  export interface IImportBackupPhraseModuleCss {
    container: string;
    item: string;
    items: string;
    word: string;
  }
}

declare const ImportBackupPhraseModuleCssModule: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss;
};

export = ImportBackupPhraseModuleCssModule;
