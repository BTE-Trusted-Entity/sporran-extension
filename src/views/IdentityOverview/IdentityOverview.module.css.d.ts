declare namespace IdentityOverviewModuleCssNamespace {
  export interface IIdentityOverviewModuleCss {
    add: string;
    avatarSmall: string;
    button: string;
    container: string;
    credentials: string;
    heading: string;
    info: string;
    manage: string;
    subscan: string;
    upgrade: string;
  }
}

declare const IdentityOverviewModuleCssModule: IdentityOverviewModuleCssNamespace.IIdentityOverviewModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentityOverviewModuleCssNamespace.IIdentityOverviewModuleCss;
};

export = IdentityOverviewModuleCssModule;
