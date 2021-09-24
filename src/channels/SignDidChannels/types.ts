export interface SignDidPopupInput {
  plaintext: string;
  origin: string;
}

export interface SignDidPopupOutput {
  signature: string;
  did: string;
}
