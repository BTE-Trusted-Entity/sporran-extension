declare namespace VerifyBackupPhraseModuleCssNamespace {
  export interface IVerifyBackupPhraseModuleCss {
    backButton: string;
    button: string;
    container: string;
    correct: string;
    error: string;
    incorrect: string;
    selectedWordsContainer: string;
  }
}

declare const VerifyBackupPhraseModuleCssModule: VerifyBackupPhraseModuleCssNamespace.IVerifyBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VerifyBackupPhraseModuleCssNamespace.IVerifyBackupPhraseModuleCss;
};

export = VerifyBackupPhraseModuleCssModule;
