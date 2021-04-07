declare namespace AddAccountModuleCssNamespace {
  export interface IAddAccountModuleCss {
    toggle: string;
  }
}

declare const AddAccountModuleCssModule: AddAccountModuleCssNamespace.IAddAccountModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddAccountModuleCssNamespace.IAddAccountModuleCss;
};

export = AddAccountModuleCssModule;
