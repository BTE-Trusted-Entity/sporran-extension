declare namespace CredentialCardModuleCssNamespace {
  export interface ICredentialCardModuleCss {
    collapse: string;
    credential: string;
    credentialsList: string;
    detailFirstProp: string;
    detailName: string;
    details: string;
    expand: string;
    expanded: string;
  }
}

declare const CredentialCardModuleCssModule: CredentialCardModuleCssNamespace.ICredentialCardModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CredentialCardModuleCssNamespace.ICredentialCardModuleCss;
};

export = CredentialCardModuleCssModule;
