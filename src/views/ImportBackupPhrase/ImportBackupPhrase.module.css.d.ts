declare namespace ImportBackupPhraseModuleCssNamespace {
  export interface IImportBackupPhraseModuleCss {
    button: string;
    buttonLine: string;
    container: string;
    errorTooltip: string;
    heading: string;
    info: string;
    input: string;
    item: string;
    items: string;
    tooltip: string;
    wordErrorTooltip: string;
  }
}

declare const ImportBackupPhraseModuleCssModule: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImportBackupPhraseModuleCssNamespace.IImportBackupPhraseModuleCss;
};

export = ImportBackupPhraseModuleCssModule;
