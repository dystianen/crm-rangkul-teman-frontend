import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductLpfStore = (productId: string) => customStore({
  loadUrl: `${API_PATH.PRODUCT_MANAGE}/lpf/${productId}`,
  insertUrl: `${API_PATH.PRODUCT_MANAGE}/lpf`,
  patchUrl: `${API_PATH.PRODUCT_MANAGE}/lpf`,
});

export const productLpfDetailApi = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/lpf/detail/${id}`);
  return resp.data;
};

export const createProductLpfApi = async (request: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/lpf`, request);
  return resp.data;
};

export const updateProductLpfApi = async (id: string, request: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/lpf/${id}`, request);
  return resp.data;
};
