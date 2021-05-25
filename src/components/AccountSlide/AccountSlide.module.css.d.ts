declare namespace AccountSlideModuleCssNamespace {
  export interface IAccountSlideModuleCss {
    cancel: string;
    centeredName: string;
    form: string;
    import: string;
    input: string;
    name: string;
    new: string;
    save: string;
  }
}

declare const AccountSlideModuleCssModule: AccountSlideModuleCssNamespace.IAccountSlideModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountSlideModuleCssNamespace.IAccountSlideModuleCss;
};

export = AccountSlideModuleCssModule;
