declare namespace IdentitySlideModuleCssNamespace {
  export interface IIdentitySlideModuleCss {
    add: string;
    cancel: string;
    centeredNameLine: string;
    form: string;
    fullDid: string;
    input: string;
    name: string;
    nameLine: string;
    save: string;
  }
}

declare const IdentitySlideModuleCssModule: IdentitySlideModuleCssNamespace.IIdentitySlideModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentitySlideModuleCssNamespace.IIdentitySlideModuleCss;
};

export = IdentitySlideModuleCssModule;
