declare namespace RemoveAccountModuleCssNamespace {
  export interface IRemoveAccountModuleCss {
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

declare const RemoveAccountModuleCssModule: RemoveAccountModuleCssNamespace.IRemoveAccountModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RemoveAccountModuleCssNamespace.IRemoveAccountModuleCss;
};

export = RemoveAccountModuleCssModule;
