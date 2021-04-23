export const MessageType = {
  balanceChangeRequest: 'balanceChangeRequest',
  balanceChangeResponse: 'balanceChangeResponse',
  feeRequest: 'feeRequest',
  savePasswordRequest: 'savePasswordRequest',
  getPasswordRequest: 'getPasswordRequest',
  forgetPasswordRequest: 'forgetPasswordRequest',
  forgetAllPasswordsRequest: 'forgetAllPasswordsRequest',
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

export interface ForgetPasswordRequest {
  type: 'forgetPasswordRequest';
  data: {
    address: string;
  };
}

export interface ForgetAllPasswordsRequest {
  type: 'forgetAllPasswordsRequest';
}
