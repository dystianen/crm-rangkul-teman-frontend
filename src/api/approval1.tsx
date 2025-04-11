import { AppLoanDetailRequest } from "src/interfaces/appLoanOnboarding";
import { customStore } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxGet, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";

export const listStore = customStore({ loadUrl: `${API_PATH.APPROVAL}/manual/approve/1/list` });
export const getDetail = async (id: string): Promise<AppLoanDetailRequest> => {
  const resp = await ajaxGet(`${API_PATH.APPROVAL}/manual/approve/1/detail/${id}`);
  return resp.data;
};

export const rejectReasonStore = dataRawCustomStore(`${API_PATH.APPROVAL}/reject/reason?`);
export const approvalHistoryStore = (appId: string) =>
  dataRawCustomStore(`${API_PATH.APPROVAL}/history/${appId}?`);
export const appFilesStore = (appId: string) =>
  dataRawCustomStore(`/api/trx/application/files/${appId}?`);

export const approvalApp1 = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPROVAL}/manual/approve/1/${appId}`, payload);
  return resp.data;
};

export const rejectApp1 = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPROVAL}/manual/reject/1`, payload);
  return resp.data;
};

export const retryApprovalHistory = async (type: string, appId: string): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPROVAL}/${type}`, { appId });
  return resp.data;
};
