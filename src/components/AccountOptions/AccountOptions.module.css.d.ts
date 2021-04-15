declare namespace AccountOptionsModuleCssNamespace {
  export interface IAccountOptionsModuleCss {
    toggle: string;
    wrapper: string;
  }
}

declare const AccountOptionsModuleCssModule: AccountOptionsModuleCssNamespace.IAccountOptionsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountOptionsModuleCssNamespace.IAccountOptionsModuleCss;
};

export = AccountOptionsModuleCssModule;
