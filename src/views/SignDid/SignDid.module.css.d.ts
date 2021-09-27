declare namespace SignDidModuleCssNamespace {
  export interface ISignDidModuleCss {
    address: string;
    buttonsLine: string;
    container: string;
    heading: string;
    label: string;
    origin: string;
    plaintext: string;
    plaintextLine: string;
    reject: string;
    subline: string;
    submit: string;
  }
}

declare const SignDidModuleCssModule: SignDidModuleCssNamespace.ISignDidModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SignDidModuleCssNamespace.ISignDidModuleCss;
};

export = SignDidModuleCssModule;
