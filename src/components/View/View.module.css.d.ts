declare namespace ViewModuleCssNamespace {
  export interface IViewModuleCss {
    view: string;
  }
}

declare const ViewModuleCssModule: ViewModuleCssNamespace.IViewModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ViewModuleCssNamespace.IViewModuleCss;
};

export = ViewModuleCssModule;
