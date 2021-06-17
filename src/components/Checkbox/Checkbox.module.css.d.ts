declare namespace CheckboxModuleCssNamespace {
  export interface ICheckboxModuleCss {
    checkbox: string;
  }
}

declare const CheckboxModuleCssModule: CheckboxModuleCssNamespace.ICheckboxModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CheckboxModuleCssNamespace.ICheckboxModuleCss;
};

export = CheckboxModuleCssModule;
