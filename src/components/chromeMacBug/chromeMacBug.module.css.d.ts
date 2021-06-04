declare namespace ChromeMacBugModuleCssNamespace {
  export interface IChromeMacBugModuleCss {
    'mac-bug-redraw': string;
    'redraw-forever': string;
  }
}

declare const ChromeMacBugModuleCssModule: ChromeMacBugModuleCssNamespace.IChromeMacBugModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ChromeMacBugModuleCssNamespace.IChromeMacBugModuleCss;
};

export = ChromeMacBugModuleCssModule;
