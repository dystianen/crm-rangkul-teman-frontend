export type TReqSavingAppCreate = {
  ktp: string;
  productId: string;
};

export type TResSavingAppCreate = {
  id: string;
  ktp: string;
  productId: string;
};

export type TReqSavingApplication = {
  id: string;
  amount: number;
  termMonth: string;
  bankId: string;
  bankAccountNumber: string;
  bankAccountIsVerified: boolean;
  bankAccountVerificationId: string;
};

export type TResSavingApplication = {
  id: string;
  contactName: string;
  contactPhone: string;
  idCardNumber: string;
  bankId: string;
  bankAccountNumber: string;
  bankAccountIsVerified: boolean;
  bankAccountVerificationId: string;
  status: string;
  isEditable: boolean;
  termMonth: string;
  amount: number;
};

export type TResSavingSubmit = {
  id: string;
};

export type TResSavingContractDetail = {
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
  id: string;
  seqId: string;
  startOn: string;
  finishOn: string;
  statusId: string;
  statusName: string;
  contactName: string;
  amount: number;
  accrualInterest: number;
  appId: string;
  appSeqId: string;
  contactId?: string;
  isRenewOnDue: boolean;
  isWithdrawOnDue: boolean;
  statusIsActive: boolean;
};

export type TResSavingCustomerDetail = {
  id: string;
  seqId: number;
  name: string;
  contactPhone: string;
  contactEmail: string;
  ktp: string;
  balanceSaving: number;
  balanceDeposit: number;
  balanceTotal: number;
  lastTransactionOn: string;
  destBankAccountNumber: string;
  destBankId: string;
  destBankName: string;
};

export type TResSavingWithdrawDetail = {
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
  id: string;
  seqId: number;
  description: string;
  contactId: string;
  amount: number;
  statusId: string;
  contractId: string;
  productId: string;
  bankId: string;
  bankAccNumber: string;
  bankAccName: string;
  statusName: string;
  contractSeqId: number;
  contactSeqId: number;
  contactName: string;
  contactPhone: string;
  contactIdNumber: string;
  createdByName: string;
  modifiedByName: string;
};

export type TReqCreateSavingWithdraw = {
  ktp?: string;
  amount: number;
  bankId: string;
  bankAccNumber: string;
};

export type TReqCheckBankAccountByContact = {
  contactId: string;
  bankId: string;
  bankAccountNumber: string;
};

export type TReqPartialUpdateSavingContract = {
  isWithdrawOnDue: boolean;
  isRenewOnDue: boolean;
};
