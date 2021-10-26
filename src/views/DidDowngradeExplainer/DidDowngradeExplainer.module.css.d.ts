declare namespace DidDowngradeExplainerModuleCssNamespace {
  export interface IDidDowngradeExplainerModuleCss {
    container: string;
    cta: string;
    explanation: string;
    heading: string;
    info: string;
    subline: string;
    warning: string;
  }
}

declare const DidDowngradeExplainerModuleCssModule: DidDowngradeExplainerModuleCssNamespace.IDidDowngradeExplainerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidDowngradeExplainerModuleCssNamespace.IDidDowngradeExplainerModuleCss;
};

export = DidDowngradeExplainerModuleCssModule;
