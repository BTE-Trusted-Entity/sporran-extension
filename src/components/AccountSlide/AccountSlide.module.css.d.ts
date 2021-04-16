declare namespace AccountSlideModuleCssNamespace {
  export interface IAccountSlideModuleCss {
    import: string;
    name: string;
    new: string;
  }
}

declare const AccountSlideModuleCssModule: AccountSlideModuleCssNamespace.IAccountSlideModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountSlideModuleCssNamespace.IAccountSlideModuleCss;
};

export = AccountSlideModuleCssModule;
