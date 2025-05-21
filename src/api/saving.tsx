import { customStore, customStoreSaving } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxGet, ajaxPatch, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";
import {
  TReqCheckBankAccountByContact,
  TReqCreateSavingWithdraw,
  TReqResSavingSubmit,
  TReqSavingAppCreate,
  TResSavingAppCreate,
  TResSavingContractDetail,
  TResSavingCustomerDetail,
  TResSavingSubmit,
  TResSavingWithdrawDetail
} from "./types/ISaving";

export const listProductApplicationStore = customStore({
  loadUrl: `${API_PATH.SAVING_DEPOSIT}/app`
});

export const listProductApplication = dataRawCustomStore(
  `${API_PATH.SAVING_DEPOSIT}/product/deposit?`
);

export const listProductApplicationTerm = dataRawCustomStore(
  `${API_PATH.SAVING_DEPOSIT}/product/deposit/term?`
);

export const listSavingPaymentStore = customStore({
  loadUrl: `${API_PATH.SAVING_DEPOSIT}/payment`
});

export const listSavingContractStore = customStore({
  loadUrl: `${API_PATH.SAVING_DEPOSIT}/contract`
});

export const listSavingContractCashflowStore = (id: string) =>
  customStore({
    loadUrl: `${API_PATH.SAVING_DEPOSIT}/contract/${id}/cashflow`
  });

export const listSavingCustomerStore = customStoreSaving({
  loadUrl: `${API_PATH.SAVING_DEPOSIT}/member`
});

export const createSavingApplication = async (
  payload: TReqSavingAppCreate
): Promise<TResSavingAppCreate> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/app/create`, payload);
  return resp.data;
};

export const submitSavingApplication = async (
  payload: TReqResSavingSubmit
): Promise<TResSavingSubmit> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/app/submit`, payload);
  return resp.data;
};

export const getDetailSavingApplication = async (
  savingId: string
): Promise<TReqResSavingSubmit> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/app/${savingId}`);
  return resp.data;
};

export const getDetailSavingContract = async (
  savingId: string
): Promise<TResSavingContractDetail> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/contract/${savingId}`);
  return resp.data;
};

export const getSavingContractActivity = async (contractId: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/contract/activity/${contractId}`);
  return resp.data;
};

export const postSavingContractPartialUpdate = async (
  id: string,
  payload: { isRenewOnDue: boolean; isWithdrawOnDue: boolean }
): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.SAVING_DEPOSIT}/contract/partialupdate/${id}`, payload);
  return resp.data;
};

export const getDetailSavingCustomer = async (
  savingId: string
): Promise<TResSavingCustomerDetail> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/member/${savingId}`);
  return resp.data;
};

export const getSavingCustomerActivity = async (contractId: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/member/activity/${contractId}`);
  return resp.data;
};

export const postWithdrawDeposit = async (contractId: string): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/withdraw/create/deposit`, {
    contractId
  });
  return resp.data;
};

export const listSavingWithdrawStore = customStore({
  loadUrl: `${API_PATH.SAVING_DEPOSIT}/withdraw`
});

export const getDetailSavingWithdraw = async (id: string): Promise<TResSavingWithdrawDetail> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/withdraw/${id}`);
  return resp.data;
};

export const getSavingWithdrawActivity = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/withdraw/activity/${id}`);
  return resp.data;
};

export const approveSavingWithdraw = async (withdrawId: string): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/withdraw/approve`, {
    withdrawId
  });
  return resp.data;
};

export const rejectSavingWithdraw = async (payload: {
  withdrawId: string;
  rejectReason: string;
  description: string;
}): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/withdraw/reject`, payload);
  return resp.data;
};
export const createSavingWithdraw = async (payload: TReqCreateSavingWithdraw): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/withdraw/create/saving`, payload);
  return resp.data;
};

export const rejectReasonWithdrawStore = dataRawCustomStore(
  `${API_PATH.SAVING_DEPOSIT}/withdraw/reject/reason?`
);

export const checkBankAccountByContact = async (
  payload: TReqCheckBankAccountByContact
): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.BANK_CHECK}/byContact`, payload);
  return resp.data;
};
