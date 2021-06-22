declare namespace ReviewTransactionModuleCssNamespace {
  export interface IReviewTransactionModuleCss {
    address: string;
    buttonsLine: string;
    cancel: string;
    container: string;
    detailName: string;
    details: string;
    detailsHidden: string;
    heading: string;
    hideDetails: string;
    recipient: string;
    showDetails: string;
    subline: string;
    submit: string;
    totalLine: string;
  }
}

declare const ReviewTransactionModuleCssModule: ReviewTransactionModuleCssNamespace.IReviewTransactionModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReviewTransactionModuleCssNamespace.IReviewTransactionModuleCss;
};

export = ReviewTransactionModuleCssModule;
