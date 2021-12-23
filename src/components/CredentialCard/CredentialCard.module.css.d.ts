declare namespace CredentialCardModuleCssNamespace {
  export interface ICredentialCardModuleCss {
    backup: string;
    buttons: string;
    collapse: string;
    collapsedCredential: string;
    collapsedName: string;
    collapsedShareCredential: string;
    collapsedValue: string;
    credential: string;
    credentialsList: string;
    detail: string;
    detailName: string;
    detailValue: string;
    details: string;
    editName: string;
    expand: string;
    expanded: string;
    hash: string;
    input: string;
    name: string;
    nameValue: string;
    notAttested: string;
    required: string;
    requiredInfo: string;
    remove: string;
    rule: string;
    select: string;
    selectable: string;
    share: string;
    shareExpanded: string;
    shareLabel: string;
    shareTechnical: string;
    technical: string;
  }
}

declare const CredentialCardModuleCssModule: CredentialCardModuleCssNamespace.ICredentialCardModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CredentialCardModuleCssNamespace.ICredentialCardModuleCss;
};

export = CredentialCardModuleCssModule;
