declare namespace TableModuleCssNamespace {
  export interface ITableModuleCss {
    table: string;
    td: string;
    th: string;
    tr: string;
  }
}

declare const TableModuleCssModule: TableModuleCssNamespace.ITableModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TableModuleCssNamespace.ITableModuleCss;
};

export = TableModuleCssModule;
