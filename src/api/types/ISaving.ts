export type TReqSavingAppCreate = {
  ktp: string;
  productId: string;
};

export type TResSavingAppCreate = {
  id: string;
  ktp: string;
  productId: string;
};

export type TReqResSavingSubmit = {
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
  isEditable?: boolean;
};

export type TResSavingSubmit = {
  id: string;
};
