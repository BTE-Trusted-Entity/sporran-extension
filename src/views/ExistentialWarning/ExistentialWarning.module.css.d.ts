declare namespace ExistentialWarningModuleCssNamespace {
  export interface IExistentialWarningModuleCss {
    buttonsLine: string;
    cancel: string;
    confirm: string;
    container: string;
    headline: string;
    subline: string;
    warning: string;
  }
}

declare const ExistentialWarningModuleCssModule: ExistentialWarningModuleCssNamespace.IExistentialWarningModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExistentialWarningModuleCssNamespace.IExistentialWarningModuleCss;
};

export = ExistentialWarningModuleCssModule;
