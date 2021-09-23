declare namespace DidUpgradeModuleCssNamespace {
  export interface IDidUpgradeModuleCss {
    buttonsLine: string;
    cancel: string;
    container: string;
    errorTooltip: string;
    heading: string;
    subline: string;
    submit: string;
  }
}

declare const DidUpgradeModuleCssModule: DidUpgradeModuleCssNamespace.IDidUpgradeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidUpgradeModuleCssNamespace.IDidUpgradeModuleCss;
};

export = DidUpgradeModuleCssModule;
