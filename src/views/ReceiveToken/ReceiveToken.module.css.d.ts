declare namespace ReceiveTokenModuleCssNamespace {
  export interface IReceiveTokenModuleCss {
    accountBox: string;
    addressBox: string;
    container: string;
    dialog: string;
    dialogClose: string;
    qrCode: string;
    qrCodeLarge: string;
    qrCodeShadow: string;
    qrCodeToggle: string;
  }
}

declare const ReceiveTokenModuleCssModule: ReceiveTokenModuleCssNamespace.IReceiveTokenModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReceiveTokenModuleCssNamespace.IReceiveTokenModuleCss;
};

export = ReceiveTokenModuleCssModule;
