declare namespace IdentityOptionsModuleCssNamespace {
  export interface IIdentityOptionsModuleCss {
    toggle: string;
    wrapper: string;
  }
}

declare const IdentityOptionsModuleCssModule: IdentityOptionsModuleCssNamespace.IIdentityOptionsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentityOptionsModuleCssNamespace.IIdentityOptionsModuleCss;
};

export = IdentityOptionsModuleCssModule;
