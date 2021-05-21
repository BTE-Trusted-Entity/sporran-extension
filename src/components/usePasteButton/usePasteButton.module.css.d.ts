declare namespace UsePasteButtonModuleCssNamespace {
  export interface IUsePasteButtonModuleCss {
    paste: string;
  }
}

declare const UsePasteButtonModuleCssModule: UsePasteButtonModuleCssNamespace.IUsePasteButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UsePasteButtonModuleCssNamespace.IUsePasteButtonModuleCss;
};

export = UsePasteButtonModuleCssModule;
