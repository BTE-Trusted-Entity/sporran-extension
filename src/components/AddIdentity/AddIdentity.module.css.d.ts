declare namespace AddIdentityModuleCssNamespace {
  export interface IAddIdentityModuleCss {
    toggle: string;
  }
}

declare const AddIdentityModuleCssModule: AddIdentityModuleCssNamespace.IAddIdentityModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddIdentityModuleCssNamespace.IAddIdentityModuleCss;
};

export = AddIdentityModuleCssModule;
