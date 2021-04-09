declare namespace QrCodeModuleCssNamespace {
  export interface IQrCodeModuleCss {
    component: string;
    logo: string;
  }
}

declare const QrCodeModuleCssModule: QrCodeModuleCssNamespace.IQrCodeModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: QrCodeModuleCssNamespace.IQrCodeModuleCss;
};

export = QrCodeModuleCssModule;
