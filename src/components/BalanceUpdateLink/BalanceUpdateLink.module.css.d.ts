declare namespace BalanceUpdateLinkModuleCssNamespace {
  export interface IBalanceUpdateLinkModuleCss {
    update: string;
  }
}

declare const BalanceUpdateLinkModuleCssModule: BalanceUpdateLinkModuleCssNamespace.IBalanceUpdateLinkModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BalanceUpdateLinkModuleCssNamespace.IBalanceUpdateLinkModuleCss;
};

export = BalanceUpdateLinkModuleCssModule;
