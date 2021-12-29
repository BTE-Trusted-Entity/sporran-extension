export interface SignDidPopupInput {
  plaintext: string;
  origin: string;
  dAppName: string;
}

export interface SignDidPopupOutput {
  signature: string;
  did: string;
}
