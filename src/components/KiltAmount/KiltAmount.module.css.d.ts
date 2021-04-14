declare namespace KiltAmountModuleCssNamespace {
  export interface IKiltAmountModuleCss {
    balance: string;
  }
}

declare const KiltAmountModuleCssModule: KiltAmountModuleCssNamespace.IKiltAmountModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: KiltAmountModuleCssNamespace.IKiltAmountModuleCss;
};

export = KiltAmountModuleCssModule;
