declare namespace AvatarModuleCssNamespace {
  export interface IAvatarModuleCss {
    Armstrong: string;
    Barclay: string;
    Brodie: string;
    Bruce: string;
    Buchanan: string;
    Cameron: string;
    Campbell: string;
    Chisholm: string;
    Clanranald: string;
    Comyn: string;
    Cunningham: string;
    Douglas: string;
    Dundas: string;
    Erskine: string;
    Farquharson: string;
    Forbes: string;
    Fraser: string;
    Gordon: string;
    Graham: string;
    Grant: string;
    Gunn: string;
    Hamilton: string;
    Hay: string;
    Lamont: string;
    MacArthur: string;
    MacDonald: string;
    MacDuff: string;
    MacFarlane: string;
    MacGregor: string;
    MacIntyre: string;
    MacKay: string;
    MacKenzie: string;
    MacKinnon: string;
    MacKintosh: string;
    MacLachlan: string;
    MacLean: string;
    MacLeod: string;
    MacNab: string;
    MacNeil: string;
    MacPherson: string;
    MacQueen: string;
    Menzies: string;
    Munro: string;
    Murray: string;
    Ranald: string;
    Robertson: string;
    Scott: string;
    Sinclair: string;
    Stewart: string;
    Stuart: string;
    Sutherland: string;
    Wallace: string;
    identicon: string;
    tartan: string;
  }
}

declare const AvatarModuleCssModule: AvatarModuleCssNamespace.IAvatarModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarModuleCssNamespace.IAvatarModuleCss;
};

export = AvatarModuleCssModule;
