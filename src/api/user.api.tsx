import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";
import {customStore} from "../model/customStore";
import {dataRawCustomStore} from "../model/datagrid";

export const schemeStore = dataRawCustomStore(`${API_PATH.DATA_MASTER}/branch/scheme/list?`);
export const roleStore = dataRawCustomStore(`${API_PATH.DATA_MASTER}/sys/role/list?`);

export const listUserStore = customStore({loadUrl: API_PATH.USER});
export const sendWhatApp = async (data: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.USER}/sendWhatApp`, data);
  return resp.data;
};
export const createUser = async (data: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.USER}/create`, data);
  return resp.data;
};
export const updateUser = async (id: string, data: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.USER}/update/${id}`, data);
  return resp.data;
};
export const resetPasswordUser = async (id: string): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.USER}/reset/password/${id}`);
  return resp.data;
};
export const enableUser = async (id: string): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.USER}/enable/${id}`);
  return resp.data;
};
export const disableUser = async (id: string): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.USER}/disable/${id}`);
  return resp.data;
};
export const getUserDetail = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.USER}/${id}`);
  return resp.data;
};


