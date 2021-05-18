declare namespace AuthorizeDAppModuleCssNamespace {
  export interface IAuthorizeDAppModuleCss {
    authorize: string;
    container: string;
    heading: string;
    origin: string;
    reject: string;
    subline: string;
    warning: string;
  }
}

declare const AuthorizeDAppModuleCssModule: AuthorizeDAppModuleCssNamespace.IAuthorizeDAppModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AuthorizeDAppModuleCssNamespace.IAuthorizeDAppModuleCss;
};

export = AuthorizeDAppModuleCssModule;
