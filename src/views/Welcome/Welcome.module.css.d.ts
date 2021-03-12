declare namespace WelcomeModuleCssNamespace {
  export interface IWelcomeModuleCss {
    button: string;
    container: string;
    info: string;
    logo: string;
  }
}

declare const WelcomeModuleCssModule: WelcomeModuleCssNamespace.IWelcomeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WelcomeModuleCssNamespace.IWelcomeModuleCss;
};

export = WelcomeModuleCssModule;
