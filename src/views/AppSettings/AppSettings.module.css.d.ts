declare namespace AppSettingsModuleCssNamespace {
  export interface IAppSettingsModuleCss {
    cancel: string;
    container: string;
    endpoint: string;
    endpointLine: string;
    heading: string;
    reset: string;
    save: string;
    subline: string;
  }
}

declare const AppSettingsModuleCssModule: AppSettingsModuleCssNamespace.IAppSettingsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppSettingsModuleCssNamespace.IAppSettingsModuleCss;
};

export = AppSettingsModuleCssModule;
