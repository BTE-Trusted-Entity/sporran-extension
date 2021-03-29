declare namespace InputModuleCssNamespace {
  export interface IInputModuleCss {
    input: string;
    inputKiltAmount: string;
  }
}

declare const InputModuleCssModule: InputModuleCssNamespace.IInputModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputModuleCssNamespace.IInputModuleCss;
};

export = InputModuleCssModule;
