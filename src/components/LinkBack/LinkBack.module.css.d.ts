declare namespace LinkBackModuleCssNamespace {
  export interface ILinkBackModuleCss {
    linkBack: string;
  }
}

declare const LinkBackModuleCssModule: LinkBackModuleCssNamespace.ILinkBackModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LinkBackModuleCssNamespace.ILinkBackModuleCss;
};

export = LinkBackModuleCssModule;
