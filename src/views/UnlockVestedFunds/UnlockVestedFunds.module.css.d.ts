declare namespace UnlockVestedFundsModuleCssNamespace {
  export interface IUnlockVestedFundsModuleCss {
    avatar: string;
    buttonsLine: string;
    cancel: string;
    container: string;
    errorTooltip: string;
    explanation: string;
    heading: string;
    name: string;
    subline: string;
    submit: string;
  }
}

declare const UnlockVestedFundsModuleCssModule: UnlockVestedFundsModuleCssNamespace.IUnlockVestedFundsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UnlockVestedFundsModuleCssNamespace.IUnlockVestedFundsModuleCss;
};

export = UnlockVestedFundsModuleCssModule;
