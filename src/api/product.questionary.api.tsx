import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";
import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";

export const listProductQuestionaryStore = (category: string, productId: string) => customStore({
  loadUrl: `${API_PATH.PRODUCT_MANAGE}/question/${category}/${productId}`,
  insertUrl: `${API_PATH.PRODUCT_MANAGE}/question/${category}/${productId}`,
  patchUrl: `${API_PATH.PRODUCT_MANAGE}/question/${category}/${productId}`,
});

export const productQuestionaryDetailApi = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.PRODUCT_MANAGE}/file/detail/${id}`);
  return resp.data;
};

export const createProductQuestionaryApi = async (category: string, productId: string, request: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.PRODUCT_MANAGE}/question/${category}/${productId}`, request);
  return resp.data;
};

export const updateProductQuestionaryApi = async (category: string, productId: string, request: any): Promise<any> => {
  const resp = await ajaxPatch(`${API_PATH.PRODUCT_MANAGE}/question/${category}/${productId}`, request);
  return resp.data;
};
