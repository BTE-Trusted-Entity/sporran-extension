declare namespace SignDAppModuleCssNamespace {
  export interface ISignDAppModuleCss {
    account: string;
    address: string;
    addressLine: string;
    avatar: string;
    buttonsLine: string;
    container: string;
    detailName: string;
    detailValue: string;
    details: string;
    heading: string;
    reject: string;
    submit: string;
  }
}

declare const SignDAppModuleCssModule: SignDAppModuleCssNamespace.ISignDAppModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SignDAppModuleCssNamespace.ISignDAppModuleCss;
};

export = SignDAppModuleCssModule;
