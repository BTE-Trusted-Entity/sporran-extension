declare namespace PasswordFieldModuleCssNamespace {
  export interface IPasswordFieldModuleCss {
    errorTooltip: string;
    password: string;
    passwordLabel: string;
    passwordLine: string;
    remember: string;
    rememberLabel: string;
    reset: string;
    resetLine: string;
  }
}

declare const PasswordFieldModuleCssModule: PasswordFieldModuleCssNamespace.IPasswordFieldModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PasswordFieldModuleCssNamespace.IPasswordFieldModuleCss;
};

export = PasswordFieldModuleCssModule;
