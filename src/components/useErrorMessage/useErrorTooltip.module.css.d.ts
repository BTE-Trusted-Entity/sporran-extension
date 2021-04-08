declare namespace UseErrorTooltipModuleCssNamespace {
  export interface IUseErrorTooltipModuleCss {
    pointer: string;
    tooltip: string;
    variables: string;
    visible: string;
  }
}

declare const UseErrorTooltipModuleCssModule: UseErrorTooltipModuleCssNamespace.IUseErrorTooltipModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UseErrorTooltipModuleCssNamespace.IUseErrorTooltipModuleCss;
};

export = UseErrorTooltipModuleCssModule;
