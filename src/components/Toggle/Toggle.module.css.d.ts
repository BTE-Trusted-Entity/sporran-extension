declare namespace ToggleModuleCssNamespace {
  export interface IToggleModuleCss {
    toggle: string;
  }
}

declare const ToggleModuleCssModule: ToggleModuleCssNamespace.IToggleModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToggleModuleCssNamespace.IToggleModuleCss;
};

export = ToggleModuleCssModule;
