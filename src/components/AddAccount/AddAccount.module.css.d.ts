declare namespace AddAccountModuleCssNamespace {
  export interface IAddAccountModuleCss {
    button: string;
    container: string;
    invisible: string;
    menu: string;
    menuItem: string;
    menuLink: string;
    menuTitle: string;
    visible: string;
  }
}

declare const AddAccountModuleCssModule: AddAccountModuleCssNamespace.IAddAccountModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddAccountModuleCssNamespace.IAddAccountModuleCss;
};

export = AddAccountModuleCssModule;
