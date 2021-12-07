declare namespace CardModuleCssNamespace {
  export interface ICardModuleCss {
    cardsContainer: string;
    collapse: string;
    collapsedCard: string;
    collapsedFirstProp: string;
    collapsedName: string;
    card: string;
    expand: string;
    expanded: string;
    list: string;
    scrollContainer: string;
  }
}

declare const CardModuleCssModule: CardModuleCssNamespace.ICardModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CardModuleCssNamespace.ICardModuleCss;
};

export = CardModuleCssModule;
