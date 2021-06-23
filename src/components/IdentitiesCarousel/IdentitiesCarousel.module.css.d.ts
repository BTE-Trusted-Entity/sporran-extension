declare namespace IdentitiesCarouselModuleCssNamespace {
  export interface IIdentitiesCarouselModuleCss {
    add: string;
    addActive: string;
    bubble: string;
    bubbleActive: string;
    bubbles: string;
    chevron: string;
    container: string;
    item: string;
    left: string;
    right: string;
  }
}

declare const IdentitiesCarouselModuleCssModule: IdentitiesCarouselModuleCssNamespace.IIdentitiesCarouselModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IdentitiesCarouselModuleCssNamespace.IIdentitiesCarouselModuleCss;
};

export = IdentitiesCarouselModuleCssModule;
