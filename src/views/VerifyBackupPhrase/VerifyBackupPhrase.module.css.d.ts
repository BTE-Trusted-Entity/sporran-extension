declare namespace VerifyBackupPhraseModuleCssNamespace {
  export interface IVerifyBackupPhraseModuleCss {
    backButton: string;
    container: string;
  }
}

declare const VerifyBackupPhraseModuleCssModule: VerifyBackupPhraseModuleCssNamespace.IVerifyBackupPhraseModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VerifyBackupPhraseModuleCssNamespace.IVerifyBackupPhraseModuleCss;
};

export = VerifyBackupPhraseModuleCssModule;
