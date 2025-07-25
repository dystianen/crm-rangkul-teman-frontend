import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductByBranchStore = (productId: string) => customStore({
  loadUrl: `${API_PATH.PRODUCT_MANAGE}/byBranch/${productId}`,
  insertUrl: `${API_PATH.PRODUCT_MANAGE}/byBranch`,
  patchUrl: `${API_PATH.PRODUCT_MANAGE}/byBranch`,
  deleteUrl: `${API_PATH.PRODUCT_MANAGE}/byBranch`,
});

export const productByBranchDetailApi = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/byBranch/detail/${id}`);
  return resp.data;
};

export const createProductByBranchApi = async (request: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/byBranch`, request);
  return resp.data;
};

export const updateProductByBranchApi = async (id: string, request: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/byBranch/${id}`, request);
  return resp.data;
};
