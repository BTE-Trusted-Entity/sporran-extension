declare namespace DidUpgradeExplainerModuleCssNamespace {
  export interface IDidUpgradeExplainerModuleCss {
    avatar: string;
    container: string;
    deposit: string;
    explanation: string;
    functionality: string;
    heading: string;
    subline: string;
    upgrade: string;
  }
}

declare const DidUpgradeExplainerModuleCssModule: DidUpgradeExplainerModuleCssNamespace.IDidUpgradeExplainerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidUpgradeExplainerModuleCssNamespace.IDidUpgradeExplainerModuleCss;
};

export = DidUpgradeExplainerModuleCssModule;
