declare namespace AccountSuccessOverlayModuleCssNamespace {
  export interface IAccountSuccessOverlayModuleCss {
    button: string;
    heading: string;
    overlay: string;
    text: string;
  }
}

declare const AccountSuccessOverlayModuleCssModule: AccountSuccessOverlayModuleCssNamespace.IAccountSuccessOverlayModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AccountSuccessOverlayModuleCssNamespace.IAccountSuccessOverlayModuleCss;
};

export = AccountSuccessOverlayModuleCssModule;
