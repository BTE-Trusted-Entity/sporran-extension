declare namespace ReceiveTokenModuleCssNamespace {
  export interface IReceiveTokenModuleCss {
    container: string;
  }
}

declare const ReceiveTokenModuleCssModule: ReceiveTokenModuleCssNamespace.IReceiveTokenModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReceiveTokenModuleCssNamespace.IReceiveTokenModuleCss;
};

export = ReceiveTokenModuleCssModule;
