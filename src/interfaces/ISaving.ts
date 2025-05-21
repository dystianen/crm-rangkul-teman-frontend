import { TResSavingCustomerDetail, TResSavingWithdrawDetail } from "src/api/types/ISaving";

export const initSavingValues = {
  productId: "",
  ktp: ""
};

export const initSavingForm = {
  id: "",
  seqId: "",
  createdOn: "",
  contactVa: "",
  amount: 0,
  termMonth: "",
  bankId: "",
  bankAccountNumber: "",
  bankAccountIsVerified: false,
  bankAccountVerificationId: "",
  contactName: "",
  contactPhone: "",
  idCardNumber: "",
  status: "",
  isEditable: false
};

export const initSavingContractDetail = {
  createdOn: "",
  modifiedOn: "",
  createdBy: "",
  modifiedBy: "",
  id: "",
  seqId: "",
  startOn: "",
  finishOn: "",
  statusId: "",
  statusName: "",
  contactName: "",
  amount: 0,
  accrualInterest: 0,
  appId: "",
  appSeqId: "",
  isWithdrawOnDue: false,
  isRenewOnDue: false,
  statusIsActive: false
};

export const defaultSavingCustomerDetail: TResSavingCustomerDetail = {
  id: "",
  seqId: 0,
  name: "",
  contactPhone: "",
  contactEmail: "",
  ktp: "",
  balanceSaving: 0,
  balanceDeposit: 0,
  balanceTotal: 0,
  lastTransactionOn: "",
  destBankAccountNumber: "",
  destBankId: "",
  destBankName: ""
};

export const defaultSavingWithdrawDetail: TResSavingWithdrawDetail = {
  createdOn: "",
  modifiedOn: "",
  createdBy: "",
  modifiedBy: "",
  id: "",
  seqId: 0,
  description: "",
  contactId: "",
  amount: 0,
  statusId: "",
  contractId: "",
  productId: "",
  bankId: "",
  bankAccNumber: "",
  bankAccName: "",
  statusName: "",
  contractSeqId: 0,
  contactSeqId: 0,
  contactName: "",
  contactPhone: "",
  contactIdNumber: "",
  createdByName: "",
  modifiedByName: ""
};
