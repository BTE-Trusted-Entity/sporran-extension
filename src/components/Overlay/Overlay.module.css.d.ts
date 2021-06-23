declare namespace OverlayModuleCssNamespace {
  export interface IOverlayModuleCss {
    button: string;
    heading: string;
    overlay: string;
    text: string;
  }
}

declare const OverlayModuleCssModule: OverlayModuleCssNamespace.IOverlayModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OverlayModuleCssNamespace.IOverlayModuleCss;
};

export = OverlayModuleCssModule;
