declare namespace ChromeMacBugModuleCssNamespace {
  export interface IChromeMacBugModuleCss {
    chromeMacBugRedraw: string;
    redrawForever: string;
  }
}

declare const ChromeMacBugModuleCssModule: ChromeMacBugModuleCssNamespace.IChromeMacBugModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ChromeMacBugModuleCssNamespace.IChromeMacBugModuleCss;
};

export = ChromeMacBugModuleCssModule;
