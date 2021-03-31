declare namespace WarningModuleCssNamespace {
  export interface IWarningModuleCss {
    backButton: string;
    cancel: string;
    confirm: string;
    container: string;
    heading: string;
    important: string;
    info: string;
  }
}

declare const WarningModuleCssModule: WarningModuleCssNamespace.IWarningModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WarningModuleCssNamespace.IWarningModuleCss;
};

export = WarningModuleCssModule;
