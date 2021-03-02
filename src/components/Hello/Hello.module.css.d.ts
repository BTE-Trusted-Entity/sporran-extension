declare namespace HelloModuleCssNamespace {
  export interface IHelloModuleCss {
    text: string;
  }
}

declare const HelloModuleCssModule: HelloModuleCssNamespace.IHelloModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HelloModuleCssNamespace.IHelloModuleCss;
};

export = HelloModuleCssModule;
