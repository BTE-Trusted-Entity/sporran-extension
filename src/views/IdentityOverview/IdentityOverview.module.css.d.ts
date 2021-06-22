declare namespace IdentityOverviewModuleCssNamespace {
  export interface IIdentityOverviewModuleCss {
    button: string;
    container: string;
    credentials: string;
    heading: string;
    import: string;
    info: string;
  }
}

declare const IdentityOverviewModuleCssModule: IdentityOverviewModuleCssNamespace.IIdentityOverviewModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentityOverviewModuleCssNamespace.IIdentityOverviewModuleCss;
};

export = IdentityOverviewModuleCssModule;
