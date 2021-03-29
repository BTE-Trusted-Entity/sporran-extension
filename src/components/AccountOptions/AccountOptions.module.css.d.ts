declare namespace AccountOptionsModuleCssNamespace {
  export interface IAccountOptionsModuleCss {
    button: string;
    container: string;
    hidden: string;
    list: string;
    listItem: string;
    menu: string;
    menuHeading: string;
  }
}

declare const AccountOptionsModuleCssModule: AccountOptionsModuleCssNamespace.IAccountOptionsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountOptionsModuleCssNamespace.IAccountOptionsModuleCss;
};

export = AccountOptionsModuleCssModule;
