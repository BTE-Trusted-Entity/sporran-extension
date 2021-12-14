declare namespace DidManageModuleCssNamespace {
  export interface IDidManageModuleCss {
    connect: string;
    container: string;
    didLine: string;
    downgrade: string;
    endpoints: string;
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
