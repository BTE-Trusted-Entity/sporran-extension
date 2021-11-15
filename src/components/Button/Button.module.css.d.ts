declare namespace ButtonModuleCssNamespace {
  export interface IButtonModuleCss {
    buttonCheckmark: string;
    buttonCross: string;
    buttonIcon: string;
    buttonPrimary: string;
    buttonSecondary: string;
    buttonTertiary: string;
    buttonWide: string;
    circle: string;
  }
}

declare const ButtonModuleCssModule: ButtonModuleCssNamespace.IButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonModuleCssNamespace.IButtonModuleCss;
};

export = ButtonModuleCssModule;
