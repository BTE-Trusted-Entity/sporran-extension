declare namespace ErrorTooltipModuleCssNamespace {
  export interface IErrorTooltipModuleCss {
    tooltip: string;
  }
}

declare const ErrorTooltipModuleCssModule: ErrorTooltipModuleCssNamespace.IErrorTooltipModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ErrorTooltipModuleCssNamespace.IErrorTooltipModuleCss;
};

export = ErrorTooltipModuleCssModule;
