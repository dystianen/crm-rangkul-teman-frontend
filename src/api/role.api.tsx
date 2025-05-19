import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {dataRawCustomStore} from "../model/datagrid";
import {ajaxPatch, ajaxPost} from "./http.api";

export const accessStore = dataRawCustomStore(`${API_PATH.ACCESS}?`);
export const createAccess = async (data: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.ACCESS}/create`, data);
  return resp.data;
};
export const updateAccess = async (data: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.ACCESS}/update`, data);
  return resp.data;
};

export const roleStore = dataRawCustomStore(`${API_PATH.ROLE}/list?`);
export const listRoleStore = customStore({loadUrl: API_PATH.ROLE});
export const updateAccessRole = async (data: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.ROLE}/updateAccessRole`, data);
  return resp.data;
};

export const createRole = async (data: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.ROLE}/create`, data);
  return resp.data;
};
export const updateRole = async (data: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.ROLE}/update`, data);
  return resp.data;
};
