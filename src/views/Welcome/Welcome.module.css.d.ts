declare namespace WelcomeModuleCssNamespace {
  export interface IWelcomeModuleCss {
    agree: string;
    agreeLabel: string;
    container: string;
    create: string;
    heading: string;
    import: string;
    info: string;
    terms: string;
    termsLine: string;
  }
}

declare const WelcomeModuleCssModule: WelcomeModuleCssNamespace.IWelcomeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WelcomeModuleCssNamespace.IWelcomeModuleCss;
};

export = WelcomeModuleCssModule;
