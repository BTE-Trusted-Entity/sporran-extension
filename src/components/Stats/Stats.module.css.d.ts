declare namespace StatsModuleCssNamespace {
  export interface IStatsModuleCss {
    balance: string;
    stats: string;
  }
}

declare const StatsModuleCssModule: StatsModuleCssNamespace.IStatsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StatsModuleCssNamespace.IStatsModuleCss;
};

export = StatsModuleCssModule;
