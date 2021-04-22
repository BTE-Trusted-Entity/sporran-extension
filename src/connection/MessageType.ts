export const MessageType = {
  balanceChangeRequest: 'balanceChangeRequest',
  balanceChangeResponse: 'balanceChangeResponse',
  feeRequest: 'feeRequest',
  savePasswordRequest: 'savePasswordRequest',
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
