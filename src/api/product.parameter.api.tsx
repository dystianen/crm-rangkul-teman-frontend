import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductParameterStore = (productId: string) => customStore({
  loadUrl: `${API_PATH.PRODUCT_MANAGE}/param/${productId}`,
  insertUrl: `${API_PATH.PRODUCT_MANAGE}/param`,
  patchUrl: `${API_PATH.PRODUCT_MANAGE}/param`,
});

export const productParameterDetailApi = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/param/detail/${id}`);
  return resp.data;
};

export const createProductParameterApi = async (request: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/param`, request);
  return resp.data;
};

export const updateProductParameterApi = async (id: string, request: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/param/${id}`, request);
  return resp.data;
};
