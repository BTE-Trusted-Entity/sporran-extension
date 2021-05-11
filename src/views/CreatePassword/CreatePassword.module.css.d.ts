declare namespace CreatePasswordModuleCssNamespace {
  export interface ICreatePasswordModuleCss {
    cancel: string;
    complexity: string;
    complexityGood: string;
    complexityMedium: string;
    complexityNone: string;
    complexityOk: string;
    complexityPoor: string;
    container: string;
    criteria: string;
    criteriaHeading: string;
    errorTooltip: string;
    heading: string;
    input: string;
    inputLine: string;
    lock: string;
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
