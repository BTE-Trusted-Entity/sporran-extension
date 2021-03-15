declare namespace CreatePasswordModuleCssNamespace {
  export interface ICreatePasswordModuleCss {
    errors: string;
    fail: string;
    pass: string;
  }
}

declare const CreatePasswordModuleCssModule: CreatePasswordModuleCssNamespace.ICreatePasswordModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreatePasswordModuleCssNamespace.ICreatePasswordModuleCss;
};

export = CreatePasswordModuleCssModule;
