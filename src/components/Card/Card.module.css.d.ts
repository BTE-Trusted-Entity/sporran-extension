declare namespace CardModuleCssNamespace {
  export interface ICardModuleCss {
    card: string;
    cardText: string;
    collapse: string;
    collapsedCard: string;
    collapsedName: string;
    collapsedValue: string;
    detail: string;
    detailName: string;
    details: string;
    detailValue: string;
    ellipsis: string;
    expand: string;
    expanded: string;
    fullWidthDetail: string;
    list: string;
    technical: string;
  }
}

declare const CardModuleCssModule: CardModuleCssNamespace.ICardModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CardModuleCssNamespace.ICardModuleCss;
};

export = CardModuleCssModule;
