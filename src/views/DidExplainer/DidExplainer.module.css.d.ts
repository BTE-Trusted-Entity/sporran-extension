declare namespace DidExplainerModuleCssNamespace {
  export interface IDidExplainerModuleCss {
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

declare const DidExplainerModuleCssModule: DidExplainerModuleCssNamespace.IDidExplainerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidExplainerModuleCssNamespace.IDidExplainerModuleCss;
};

export = DidExplainerModuleCssModule;
