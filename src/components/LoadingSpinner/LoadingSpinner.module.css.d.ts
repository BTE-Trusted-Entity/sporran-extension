declare namespace LoadingSpinnerModuleCssNamespace {
  export interface ILoadingSpinnerModuleCss {
    spinner: string;
  }
}

declare const LoadingSpinnerModuleCssModule: LoadingSpinnerModuleCssNamespace.ILoadingSpinnerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoadingSpinnerModuleCssNamespace.ILoadingSpinnerModuleCss;
};

export = LoadingSpinnerModuleCssModule;
