import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductStore = customStore({loadUrl: API_PATH.PRODUCT_MANAGE});

export const productDetailApi = async (id: string): Promise<any[]> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/${id}`);
  return resp.data;
};

export const copyProductApi = async (id: string): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/copy/${id}`);
  return resp.data;
};

export const enableProductApi = async (id: string): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/enable/${id}`);
  return resp.data;
};

export const disableProductApi = async (id: string): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/disable/${id}`);
  return resp.data;
};

export const updateProductApi = async (request: any): Promise<any[]> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}`, request);
  return resp.data;
};
