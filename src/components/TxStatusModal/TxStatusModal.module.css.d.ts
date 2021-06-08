declare namespace TxStatusModalModuleCssNamespace {
  export interface ITxStatusModalModuleCss {
    confirm: string;
    heading: string;
    overlay: string;
    transparent: string;
    wrapper: string;
  }
}

declare const TxStatusModalModuleCssModule: TxStatusModalModuleCssNamespace.ITxStatusModalModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TxStatusModalModuleCssNamespace.ITxStatusModalModuleCss;
};

export = TxStatusModalModuleCssModule;
