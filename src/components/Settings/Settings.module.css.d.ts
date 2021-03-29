declare namespace SettingsModuleCssNamespace {
  export interface ISettingsModuleCss {
    button: string;
    container: string;
    hidden: string;
    list: string;
    listItem: string;
    menu: string;
    menuHeading: string;
  }
}

declare const SettingsModuleCssModule: SettingsModuleCssNamespace.ISettingsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SettingsModuleCssNamespace.ISettingsModuleCss;
};

export = SettingsModuleCssModule;
