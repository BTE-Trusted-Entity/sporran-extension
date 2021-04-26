export const MessageType = {
  balanceChangeRequest: 'balanceChangeRequest',
  balanceChangeResponse: 'balanceChangeResponse',
  feeRequest: 'feeRequest',
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
