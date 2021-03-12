declare namespace WarningModuleCssNamespace {
  export interface IWarningModuleCss {
    backButton: string;
    button: string;
    buttonContainer: string;
    container: string;
  }
}

declare const WarningModuleCssModule: WarningModuleCssNamespace.IWarningModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WarningModuleCssNamespace.IWarningModuleCss;
};

export = WarningModuleCssModule;
