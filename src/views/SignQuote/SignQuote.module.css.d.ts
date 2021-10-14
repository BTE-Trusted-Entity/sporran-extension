declare namespace SignQuoteModuleCssNamespace {
  export interface ISignQuoteModuleCss {
    buttonsLine: string;
    cancel: string;
    container: string;
    costs: string;
    detailName: string;
    detailValue: string;
    details: string;
    heading: string;
    label: string;
    subline: string;
    submit: string;
  }
}

declare const SignQuoteModuleCssModule: SignQuoteModuleCssNamespace.ISignQuoteModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SignQuoteModuleCssNamespace.ISignQuoteModuleCss;
};

export = SignQuoteModuleCssModule;
