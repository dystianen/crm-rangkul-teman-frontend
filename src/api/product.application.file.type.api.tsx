import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductAppFileTypeStore = (productId: string) => customStore({
  loadUrl: `${API_PATH.PRODUCT_MANAGE}/file/${productId}`,
  insertUrl: `${API_PATH.PRODUCT_MANAGE}/file`,
  patchUrl: `${API_PATH.PRODUCT_MANAGE}/file`,
});

export const productAppFileTypeDetailApi = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/file/detail/${id}`);
  return resp.data;
};

export const createProductAppFileTypeApi = async (request: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/file`, request);
  return resp.data;
};

export const updateProductAppFileTypeApi = async (id: string, request: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/file/${id}`, request);
  return resp.data;
};
