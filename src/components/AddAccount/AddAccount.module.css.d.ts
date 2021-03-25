declare namespace AddAccountModuleCssNamespace {
  export interface IAddAccountModuleCss {
    button: string;
    container: string;
    hidden: string;
    list: string;
    listItem: string;
    menu: string;
    menuTitle: string;
  }
}

declare const AddAccountModuleCssModule: AddAccountModuleCssNamespace.IAddAccountModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddAccountModuleCssNamespace.IAddAccountModuleCss;
};

export = AddAccountModuleCssModule;
