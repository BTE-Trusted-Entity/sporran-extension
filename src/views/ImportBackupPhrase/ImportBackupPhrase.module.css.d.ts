declare namespace ImportBackupPhraseModuleCssNamespace {
  export interface IImportBackupPhraseModuleCss {
    buttonContainer: string;
    container: string;
    errors: string;
    fail: string;
    item: string;
    items: string;
    input: string;
    pass: string;
    neutral: string;
  }
}

declare const ImportBackupPhraseModuleCssModule: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss;
};

export = ImportBackupPhraseModuleCssModule;
