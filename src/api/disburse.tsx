import { customStore } from "../model/customStore";
import { ajaxGet, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";

export const listStore = customStore({ loadUrl: API_PATH.DISBURSE });
export const getDetail = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.DISBURSE}/detail/${id}`);
  return resp.data;
};

export const submitRedisburse = async (payload: { contractId: string }): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.DISBURSE}/retry`, payload);
  return resp.data;
};
