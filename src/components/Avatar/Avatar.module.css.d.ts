declare namespace AvatarModuleCssNamespace {
  export interface IAvatarModuleCss {
    avatar: string;
    identicon: string;
  }
}

declare const AvatarModuleCssModule: AvatarModuleCssNamespace.IAvatarModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarModuleCssNamespace.IAvatarModuleCss;
};

export = AvatarModuleCssModule;
