declare namespace CardModuleCssNamespace {
  export interface ICardModuleCss {
    collapse: string;
    collapsedCard: string;
    collapsedFirstProp: string;
    collapsedName: string;
    card: string;
    expand: string;
    expanded: string;
    list: string;
  }
}

declare const CardModuleCssModule: CardModuleCssNamespace.ICardModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CardModuleCssNamespace.ICardModuleCss;
};

export = CardModuleCssModule;
