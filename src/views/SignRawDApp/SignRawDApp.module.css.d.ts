declare namespace SignRawDAppModuleCssNamespace {
  export interface ISignRawDAppModuleCss {
    addressLine: string;
    avatar: string;
    buttonsLine: string;
    container: string;
    detailName: string;
    detailValue: string;
    details: string;
    heading: string;
    identity: string;
    message: string;
    reject: string;
    submit: string;
  }
}

declare const SignRawDAppModuleCssModule: SignRawDAppModuleCssNamespace.ISignRawDAppModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SignRawDAppModuleCssNamespace.ISignRawDAppModuleCss;
};

export = SignRawDAppModuleCssModule;
