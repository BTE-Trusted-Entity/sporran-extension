declare namespace CopyValueModuleCssNamespace {
  export interface ICopyValueModuleCss {
    line: string;
    long: string;
    input: string;
  }
}

declare const CopyValueModuleCssModule: CopyValueModuleCssNamespace.ICopyValueModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CopyValueModuleCssNamespace.ICopyValueModuleCss;
};

export = CopyValueModuleCssModule;
