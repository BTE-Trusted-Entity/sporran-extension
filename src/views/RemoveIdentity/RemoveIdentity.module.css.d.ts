declare namespace RemoveIdentityModuleCssNamespace {
  export interface IRemoveIdentityModuleCss {
    address: string;
    addressLabel: string;
    buttonsLine: string;
    cancel: string;
    container: string;
    explanation: string;
    heading: string;
    name: string;
    remove: string;
    subline: string;
  }
}

declare const RemoveIdentityModuleCssModule: RemoveIdentityModuleCssNamespace.IRemoveIdentityModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RemoveIdentityModuleCssNamespace.IRemoveIdentityModuleCss;
};

export = RemoveIdentityModuleCssModule;
