declare namespace MenuModuleCssNamespace {
  export interface IMenuModuleCss {
    dropdown: string;
    heading: string;
    list: string;
    listItem: string;
    toggle: string;
    wrapper: string;
  }
}

declare const MenuModuleCssModule: MenuModuleCssNamespace.IMenuModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MenuModuleCssNamespace.IMenuModuleCss;
};

export = MenuModuleCssModule;
