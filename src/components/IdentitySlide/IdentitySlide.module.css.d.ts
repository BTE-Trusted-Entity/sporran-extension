declare namespace IdentitySlideModuleCssNamespace {
  export interface IIdentitySlideModuleCss {
    cancel: string;
    centeredNameLine: string;
    create: string;
    form: string;
    import: string;
    input: string;
    name: string;
    nameLine: string;
    new: string;
    save: string;
  }
}

declare const IdentitySlideModuleCssModule: IdentitySlideModuleCssNamespace.IIdentitySlideModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentitySlideModuleCssNamespace.IIdentitySlideModuleCss;
};

export = IdentitySlideModuleCssModule;
