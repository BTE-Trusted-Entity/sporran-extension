declare namespace ExternalAccessModuleCssNamespace {
  export interface IExternalAccessModuleCss {
    allowed: string;
    back: string;
    container: string;
    denied: string;
    heading: string;
    label: string;
    list: string;
    small: string;
    subline: string;
    toggle: string;
  }
}

declare const ExternalAccessModuleCssModule: ExternalAccessModuleCssNamespace.IExternalAccessModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExternalAccessModuleCssNamespace.IExternalAccessModuleCss;
};

export = ExternalAccessModuleCssModule;
