declare namespace ImportBackupPhraseModuleCssNamespace {
  export interface IImportBackupPhraseModuleCss {
    button: string;
    container: string;
    heading: string;
    info: string;
    input: string;
    items: string;
  }
}

declare const ImportBackupPhraseModuleCssModule: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss;
};

export = ImportBackupPhraseModuleCssModule;
