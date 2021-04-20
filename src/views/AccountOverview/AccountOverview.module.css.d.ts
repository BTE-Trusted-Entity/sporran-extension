declare namespace AccountOverviewModuleCssNamespace {
  export interface IAccountOverviewModuleCss {
    button: string;
    container: string;
    heading: string;
    import: string;
    info: string;
  }
}

declare const AccountOverviewModuleCssModule: AccountOverviewModuleCssNamespace.IAccountOverviewModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountOverviewModuleCssNamespace.IAccountOverviewModuleCss;
};

export = AccountOverviewModuleCssModule;
