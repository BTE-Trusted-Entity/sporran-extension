declare namespace KiltCurrencyModuleCssNamespace {
  export interface IKiltCurrencyModuleCss {
    coin: string;
  }
}

declare const KiltCurrencyModuleCssModule: KiltCurrencyModuleCssNamespace.IKiltCurrencyModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: KiltCurrencyModuleCssNamespace.IKiltCurrencyModuleCss;
};

export = KiltCurrencyModuleCssModule;
