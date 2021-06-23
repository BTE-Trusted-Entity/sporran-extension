declare namespace GenericErrorModuleCssNamespace {
  export interface IGenericErrorModuleCss {
    text: string;
  }
}

declare const GenericErrorModuleCssModule: GenericErrorModuleCssNamespace.IGenericErrorModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GenericErrorModuleCssNamespace.IGenericErrorModuleCss;
};

export = GenericErrorModuleCssModule;
