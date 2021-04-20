declare namespace SuccessAccountOverlayModuleCssNamespace {
  export interface ISuccessAccountOverlayModuleCss {
    button: string;
    container: string;
    heading: string;
    text: string;
  }
}

declare const SuccessAccountOverlayModuleCssModule: SuccessAccountOverlayModuleCssNamespace.ISuccessAccountOverlayModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SuccessAccountOverlayModuleCssNamespace.ISuccessAccountOverlayModuleCss;
};

export = SuccessAccountOverlayModuleCssModule;
