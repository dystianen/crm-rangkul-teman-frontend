import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductTermStore = (productId: string) => customStore({
  loadUrl: `${API_PATH.PRODUCT_MANAGE}/term/${productId}`,
  insertUrl: `${API_PATH.PRODUCT_MANAGE}/term`,
  patchUrl: `${API_PATH.PRODUCT_MANAGE}/term`,
});

export const productTermDetailApi = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/term/detail/${id}`);
  return resp.data;
};

export const createProductTermApi = async (request: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/term`, request);
  return resp.data;
};

export const updateProductTermApi = async (id: string, request: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/term/${id}`, request);
  return resp.data;
};
