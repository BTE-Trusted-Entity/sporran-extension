declare namespace PopupModuleCssNamespace {
  export interface IPopupModuleCss {
    container: string;
  }
}

declare const PopupModuleCssModule: PopupModuleCssNamespace.IPopupModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PopupModuleCssNamespace.IPopupModuleCss;
};

export = PopupModuleCssModule;
