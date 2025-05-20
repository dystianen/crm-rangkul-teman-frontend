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
  isRenewOnDue: boolean | null;
  isWithdrawOnDue: boolean | null;
};

export type TResSavingCustomerDetail = {
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
  seqId: number;
  id: string;
  appId: string;
  startOn: string;
  finishOn: string;
  closedOn: string;
  amount: number;
  accrualInterest: number;
  statusId: string;
  appSeqId: string;
  contactId: string;
  contactSeqId: string;
  contactIdCardNumber: string;
  contactPhone: string;
  savingAmountBalance: number;
  depositAmountBalance: number;
  totalBalance: number;
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
