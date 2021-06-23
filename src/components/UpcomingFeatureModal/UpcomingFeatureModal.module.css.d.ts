declare namespace UpcomingFeatureModalModuleCssNamespace {
  export interface IUpcomingFeatureModalModuleCss {
    close: string;
    container: string;
    info: string;
  }
}

declare const UpcomingFeatureModalModuleCssModule: UpcomingFeatureModalModuleCssNamespace.IUpcomingFeatureModalModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UpcomingFeatureModalModuleCssNamespace.IUpcomingFeatureModalModuleCss;
};

export = UpcomingFeatureModalModuleCssModule;
