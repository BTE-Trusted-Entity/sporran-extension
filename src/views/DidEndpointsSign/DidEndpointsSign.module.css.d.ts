declare namespace DidEndpointsSignModuleCssNamespace {
  export interface IDidEndpointsSignModuleCss {
    buttonsLine: string;
    cancel: string;
    container: string;
    heading: string;
    subline: string;
    submit: string;
    value: string;
  }
}

declare const DidEndpointsSignModuleCssModule: DidEndpointsSignModuleCssNamespace.IDidEndpointsSignModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidEndpointsSignModuleCssNamespace.IDidEndpointsSignModuleCss;
};

export = DidEndpointsSignModuleCssModule;
