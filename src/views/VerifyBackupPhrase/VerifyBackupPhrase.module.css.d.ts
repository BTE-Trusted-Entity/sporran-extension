declare namespace VerifyBackupPhraseModuleCssNamespace {
  export interface IVerifyBackupPhraseModuleCss {
    cancel: string;
    container: string;
    correct: string;
    heading: string;
    incorrect: string;
    index: string;
    info: string;
    pointer: string;
    selectableWords: string;
    selectedWords: string;
    submit: string;
    tooltip: string;
    word: string;
  }
}

declare const VerifyBackupPhraseModuleCssModule: VerifyBackupPhraseModuleCssNamespace.IVerifyBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VerifyBackupPhraseModuleCssNamespace.IVerifyBackupPhraseModuleCss;
};

export = VerifyBackupPhraseModuleCssModule;
