declare namespace DidEndpointsFormModuleCssNamespace {
  export interface IDidEndpointsFormModuleCss {
    add: string;
    buttons: string;
    buttonsLine: string;
    cancel: string;
    card: string;
    collapse: string;
    collapsedCard: string;
    collapsedType: string;
    collapsedUrl: string;
    container: string;
    endpoint: string;
    expand: string;
    heading: string;
    input: string;
    label: string;
    list: string;
    loading: string;
    name: string;
    remove: string;
    subline: string;
    submit: string;
    value: string;
  }
}

declare const DidEndpointsFormModuleCssModule: DidEndpointsFormModuleCssNamespace.IDidEndpointsFormModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DidEndpointsFormModuleCssNamespace.IDidEndpointsFormModuleCss;
};

export = DidEndpointsFormModuleCssModule;
