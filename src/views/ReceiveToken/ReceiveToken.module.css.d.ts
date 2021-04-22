declare namespace ReceiveTokenModuleCssNamespace {
  export interface IReceiveTokenModuleCss {
    address: string;
    addressLine: string;
    container: string;
    copied: string;
    copy: string;
    dialog: string;
    dialogClose: string;
    heading: string;
    qrCode: string;
    qrCodeLarge: string;
    qrCodeShadow: string;
    qrCodeToggle: string;
    small: string;
    subline: string;
  }
}

declare const ReceiveTokenModuleCssModule: ReceiveTokenModuleCssNamespace.IReceiveTokenModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReceiveTokenModuleCssNamespace.IReceiveTokenModuleCss;
};

export = ReceiveTokenModuleCssModule;
