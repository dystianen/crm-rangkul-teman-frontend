import { TResSavingCustomerDetail, TResSavingWithdrawDetail } from "src/api/types/ISaving";

export const initSavingValues = {
  productId: "",
  ktp: ""
};

export const initSavingForm = {
  id: "",
  amount: 0,
  termMonth: 0,
  bankId: "",
  bankAccountNumber: "",
  bankAccountIsVerified: false,
  bankAccountVerificationId: "",
  isDeductSaving: null,
  isWithdrawOnDue: null,
  isRenewOnDue: null
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
  isWithdrawOnDue: null,
  isRenewOnDue: null
};

export const defaultSavingCustomerDetail: TResSavingCustomerDetail = {
  createdOn: "",
  modifiedOn: "",
  createdBy: "",
  modifiedBy: "",
  seqId: 0,
  id: "",
  appId: "",
  startOn: "",
  finishOn: "",
  closedOn: "",
  amount: 0,
  accrualInterest: 0,
  statusId: "",
  appSeqId: "",
  contactId: "",
  contactSeqId: "",
  contactIdCardNumber: "",
  contactPhone: "",
  savingAmountBalance: 0,
  depositAmountBalance: 0,
  totalBalance: 0
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
