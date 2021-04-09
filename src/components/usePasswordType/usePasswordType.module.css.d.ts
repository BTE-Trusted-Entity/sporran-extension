declare namespace UsePasswordTypeModuleCssNamespace {
  export interface IUsePasswordTypeModuleCss {
    hide: string;
    show: string;
    toggle: string;
  }
}

declare const UsePasswordTypeModuleCssModule: UsePasswordTypeModuleCssNamespace.IUsePasswordTypeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UsePasswordTypeModuleCssNamespace.IUsePasswordTypeModuleCss;
};

export = UsePasswordTypeModuleCssModule;
