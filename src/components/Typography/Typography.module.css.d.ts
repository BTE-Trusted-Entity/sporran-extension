declare namespace TypographyModuleCssNamespace {
  export interface ITypographyModuleCss {
    identityText: string;
    balanceText: string;
    buttonText: string;
    importantHeadline: string;
    inputText: string;
    screenHeadline: string;
    smallImportant: string;
    smallText: string;
    subline: string;
  }
}

declare const TypographyModuleCssModule: TypographyModuleCssNamespace.ITypographyModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TypographyModuleCssNamespace.ITypographyModuleCss;
};

export = TypographyModuleCssModule;
