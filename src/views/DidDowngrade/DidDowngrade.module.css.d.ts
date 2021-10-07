declare namespace DidDowngradeModuleCssNamespace {
  export interface IDidDowngradeModuleCss {
    buttonsLine: string;
    cancel: string;
    container: string;
    costs: string;
    details: string;
    errorTooltip: string;
    heading: string;
    info: string;
    subline: string;
    submit: string;
  }
}

declare const DidDowngradeModuleCssModule: DidDowngradeModuleCssNamespace.IDidDowngradeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidDowngradeModuleCssNamespace.IDidDowngradeModuleCss;
};

export = DidDowngradeModuleCssModule;
