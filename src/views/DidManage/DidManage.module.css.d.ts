declare namespace DidManageModuleCssNamespace {
  export interface IDidManageModuleCss {
    container: string;
    heading: string;
    link: string;
    subline: string;
  }
}

declare const DidManageModuleCssModule: DidManageModuleCssNamespace.IDidManageModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidManageModuleCssNamespace.IDidManageModuleCss;
};

export = DidManageModuleCssModule;
