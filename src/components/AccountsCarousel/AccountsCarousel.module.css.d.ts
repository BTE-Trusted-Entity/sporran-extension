declare namespace AccountsCarouselModuleCssNamespace {
  export interface IAccountsCarouselModuleCss {
    chevron: string;
    container: string;
    left: string;
    right: string;
  }
}

declare const AccountsCarouselModuleCssModule: AccountsCarouselModuleCssNamespace.IAccountsCarouselModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountsCarouselModuleCssNamespace.IAccountsCarouselModuleCss;
};

export = AccountsCarouselModuleCssModule;
