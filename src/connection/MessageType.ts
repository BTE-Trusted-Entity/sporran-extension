export const MessageType = {
  balanceChangeRequest: 'balanceChangeRequest',
  balanceChangeResponse: 'balanceChangeResponse',
  feeRequest: 'feeRequest',
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
