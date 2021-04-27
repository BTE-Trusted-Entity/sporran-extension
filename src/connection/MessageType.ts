export const MessageType = {
  balanceChangeRequest: 'balanceChangeRequest',
  balanceChangeResponse: 'balanceChangeResponse',
  feeRequest: 'feeRequest',
  savePasswordRequest: 'savePasswordRequest',
  getPasswordRequest: 'getPasswordRequest',
  hasSavedPasswordsRequest: 'hasSavedPasswordsRequest',
  forgetPasswordRequest: 'forgetPasswordRequest',
  forgetAllPasswordsRequest: 'forgetAllPasswordsRequest',
  transferRequest: 'transferRequest',
};

export interface BalanceChangeRequest {
  type: 'balanceChangeRequest';
  data: { address: string };
}

export interface BalanceChangeResponse {
  type: 'balanceChangeResponse';
  data: {
    address: string;
    balance: string;
  };
}

export interface FeeRequest {
  type: 'feeRequest';
  data: {
    recipient: string;
    amount: string;
  };
}

export interface SavePasswordRequest {
  type: 'savePasswordRequest';
  data: {
    password: string;
    address: string;
  };
}

export interface GetPasswordRequest {
  type: 'getPasswordRequest';
  data: {
    address: string;
  };
}

export interface HasSavedPasswordsRequest {
  type: 'hasSavedPasswordsRequest';
}

export interface ForgetPasswordRequest {
  type: 'forgetPasswordRequest';
  data: {
    address: string;
  };
}

export interface ForgetAllPasswordsRequest {
  type: 'forgetAllPasswordsRequest';
}

export interface TransferRequest {
  type: 'transferRequest';
  data: {
    address: string;
    recipient: string;
    amount: string;
    tip: string;
    password: string;
  };
}
