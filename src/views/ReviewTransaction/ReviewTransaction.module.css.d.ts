declare namespace ReviewTransactionModuleCssNamespace {
  export interface IReviewTransactionModuleCss {
    container: string;
    buttonsLine: string;
    heading: string;
    subline: string;
    recipient: string;
    address: string;
    resetLine: string;
    reset: string;
    passwordLabel: string;
    passwordLine: string;
    password: string;
    rememberLabel: string;
    remember: string;
    cancel: string;
    submit: string;
    totalLine: string;
    showDetails: string;
    hideDetails: string;
    details: string;
    detailsHidden: string;
    detailName: string;
  }
}

declare const ReviewTransactionModuleCssModule: ReviewTransactionModuleCssNamespace.IReviewTransactionModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReviewTransactionModuleCssNamespace.IReviewTransactionModuleCss;
};

export = ReviewTransactionModuleCssModule;
