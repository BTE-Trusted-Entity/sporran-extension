declare namespace UseCopyButtonModuleCssNamespace {
  export interface IUseCopyButtonModuleCss {
    copied: string;
    copy: string;
  }
}

declare const UseCopyButtonModuleCssModule: UseCopyButtonModuleCssNamespace.IUseCopyButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UseCopyButtonModuleCssNamespace.IUseCopyButtonModuleCss;
};

export = UseCopyButtonModuleCssModule;
