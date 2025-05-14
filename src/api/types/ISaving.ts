export type TReqSavingAppCreate = {
  ktp: string;
  productId: string;
};

export type TResSavingAppCreate = {
  id: string;
  ktp: string;
  productId: string;
};

export type TReqSavingSubmit = {
  id: string;
  amount: number;
  termMonth: number;
  bankId: string;
  bankAccountNumber: string;
  bankAccountIsVerified: boolean;
  bankAccountVerificationId: string;
  isDeductSaving: boolean | null;
  isWithdrawOnDue: boolean | null;
  isRenewOnDue: boolean | null;
};

export type TResSavingSubmit = {
  id: string;
};
