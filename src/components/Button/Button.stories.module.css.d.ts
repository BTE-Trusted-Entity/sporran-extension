declare namespace ButtonStoriesModuleCssNamespace {
  export interface IButtonStoriesModuleCss {
    icon: string;
    wide: string;
  }
}

declare const ButtonStoriesModuleCssModule: ButtonStoriesModuleCssNamespace.IButtonStoriesModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonStoriesModuleCssNamespace.IButtonStoriesModuleCss;
};

export = ButtonStoriesModuleCssModule;
