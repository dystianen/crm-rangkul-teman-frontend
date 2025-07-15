import { AppLoanDetailRequest } from "src/interfaces/appLoanOnboarding";
import { customStore } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxGet, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";

export const listStore = customStore({ loadUrl: `${API_PATH.APPROVAL}/manual/approve/2/list` });
export const getDetail = async (id: string): Promise<AppLoanDetailRequest> => {
  const resp = await ajaxGet(`${API_PATH.APPROVAL}/manual/approve/2/detail/${id}`);
  return resp.data;
};

export const rejectReasonStore = (approvalId?: string) =>
  dataRawCustomStore(
    approvalId
      ? `${API_PATH.APPROVAL}/reject/reason/${approvalId}?`
      : `${API_PATH.APPROVAL}/reject/reason?`
  );

export const approvalHistoryStore = (appId: string) =>
  dataRawCustomStore(`${API_PATH.APPROVAL}/history/${appId}?`);

export const appFilesStore = (appId: string) =>
  dataRawCustomStore(`/api/trx/application/files/${appId}?`);

export const approvalApp2 = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPROVAL}/manual/approve/2/${appId}`, payload);
  return resp.data;
};

export const rejectApp2 = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPROVAL}/manual/reject/2`, payload);
  return resp.data;
};
