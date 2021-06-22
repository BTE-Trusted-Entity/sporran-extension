declare namespace IdentitySuccessOverlayModuleCssNamespace {
  export interface IIdentitySuccessOverlayModuleCss {
    button: string;
    heading: string;
    overlay: string;
    text: string;
  }
}

declare const IdentitySuccessOverlayModuleCssModule: IdentitySuccessOverlayModuleCssNamespace.IIdentitySuccessOverlayModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentitySuccessOverlayModuleCssNamespace.IIdentitySuccessOverlayModuleCss;
};

export = IdentitySuccessOverlayModuleCssModule;
