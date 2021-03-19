declare namespace ImportBackupPhraseModuleCssNamespace {
  export interface IImportBackupPhraseModuleCss {
    buttonContainer: string;
    container: string;
    fail: string;
    input: string;
    item: string;
    items: string;
    neutral: string;
    pass: string;
    word: string;
  }
}

declare const ImportBackupPhraseModuleCssModule: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss;
};

export = ImportBackupPhraseModuleCssModule;
