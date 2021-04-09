declare namespace CreatePasswordModuleCssNamespace {
  export interface ICreatePasswordModuleCss {
    cancel: string;
    container: string;
    criteria: string;
    criteriaHeading: string;
    heading: string;
    input: string;
    inputLine: string;
    pass: string;
    subline: string;
    submit: string;
  }
}

declare const CreatePasswordModuleCssModule: CreatePasswordModuleCssNamespace.ICreatePasswordModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreatePasswordModuleCssNamespace.ICreatePasswordModuleCss;
};

export = CreatePasswordModuleCssModule;
