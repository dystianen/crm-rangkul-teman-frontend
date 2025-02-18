import { AxiosRequestConfig } from "axios";
import { customStore } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxDelete, ajaxGet, ajaxPatch, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";
import CustomStore from "devextreme/data/custom_store";
import { FilterPss, setFilterPss } from "src/interfaces/IFilterPss";
import qs from "qs";

export const appLoanListStore = customStore({
  loadUrl: API_PATH.APPLICATION
});

export const appLoanDetailApi = async (id: string): Promise<any[]> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/detail/${id}`);
  return resp.data;
};

export const appLoanDetailActivityApi = async (id: string): Promise<any[]> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/activity/${id}`);
  return resp.data;
};

export const getFile = async (urlPath: string, config?: AxiosRequestConfig) => {
  const resp = await ajaxGet(`/api/file/get/${urlPath}`, config);
  return resp;
};

export const getActiveProduct = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/product/list?`);
  return resp.data;
};

export const createAppLoanOnboarding = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPLICATION}/create`, payload);
  return resp.data;
};

export const createAppTemp = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.CONTACT}/create/app/tmp`, payload);
  return resp.data;
};

export const submitAppLoan = async (id: string): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPLICATION}/submit/${id}`);
  return resp.data;
};

export const checkAccess = async (accessId: string): Promise<boolean> => {
  const resp = await ajaxGet(`${API_PATH.PROFILE_ACCESS}/${accessId}`);
  return resp;
};

export const getUnsignedDoc = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/get/unsigned/${id}`);
  return resp.data;
};

export const getSignedDoc = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/get/signed/${id}`);
  return resp.data;
};


export const checkStatusSigning = async (id: string): Promise<boolean> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/check/signing/${id}`);
  return resp.data;
};

export const createAppLoanOnboardingStep1 = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPLICATION}/create/step/1/${appId}`, payload);
  return resp.data;
};

export const appCancel = async (appId: string): Promise<any> => {
  const resp = await ajaxGet(`/api/trx/application/cancel/${appId}`);
  return resp.data;
};

export const processCancel = async (appId: string): Promise<any> => {
  const resp = await ajaxGet(`/api/loan/sign/cancel/${appId}`);
  return resp.data;
};

export const createAppLoanOnboardingStep2 = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPLICATION}/create/step/2/${appId}`, payload);
  return resp.data;
};

export const submitAppLoanSignedDocument = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.APPLICATION}/submit/signed/${appId}`, payload);
  return resp.data;
};

export const detailAppStep = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/get/step/${id}`);
  return resp.data;
};

export const detailAppLoan = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.APPLICATION}/preview/${id}`);
  return resp.data;
};

export const submitStreetShop = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.CONTACT}/streetshop/${appId}`, payload);
  return resp.data;
};

export const getStreetShop = async (appId: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.CONTACT}/streetshop/${appId}`);
  return resp.data;
};

export const fetchSellingQuestions = async (appId: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.QUESTION}/selling/${appId}`);
  return resp.data;
};

export const submitSellingQuestions = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.QUESTION}/selling/${appId}`, payload);
  return resp.data;
};

export const fetchNeighbourQuestions = async (appId: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.QUESTION}/neighbour/${appId}`);
  return resp.data;
};

export const submitNeighbourQuestions = async (appId: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.QUESTION}/neighbour/${appId}`, payload);
  return resp.data;
};

export const getActiveBranchByUserStore = dataRawCustomStore(`/api/data/branch/user?`);

export const getActiveProductByBranch = (branchId: string) =>
  dataRawCustomStore(`/api/product/${branchId}?`);

export const getActiveProductStore = dataRawCustomStore(`/api/product/list?`);

export const loanTermStore = (appId: string) =>
  dataRawCustomStore(`/api/product/term/list/app/${appId}?`);
export const getListBank = dataRawCustomStore(`/api/data/bank/list?`);
export const getLoanPurpose = dataRawCustomStore(`/api/data/loan/purpose/list?`);

export const familyListStore = (id: string) =>
  new CustomStore({
    key: "id",
    load: async (loadOptions) => {
      let { sort } = loadOptions;
      if (sort === null) {
        sort = [{ selector: "modifiedOn", desc: false }];
      }
      const startVal: number | undefined = loadOptions.skip != null ? loadOptions.skip : 0,
        lengthVal: number | undefined = loadOptions.take != null ? loadOptions.take : 50;
      const paramSearch: FilterPss = {
        ...setFilterPss(),
        start: startVal,
        length: lengthVal,
        sort: sort,
        searchQuery: JSON.stringify(loadOptions.filter)
      };
      const resp = await ajaxGet(`${API_PATH.CONTACT}/data/family/${id}?${qs.stringify(paramSearch)}`);
      return resp;
    },
    cacheRawData: true,
    insert: async (values: any) => {
      const resp = await ajaxPost(`${API_PATH.CONTACT}/data/family/${id}`, values);
      console.log("insert", resp);
    },
    update: async (key: string, values: any) => {
      console.log("update", key, values);
      const resp = await ajaxPatch(`${API_PATH.CONTACT}/data/family/${id}`, values);
      console.log("update", resp);
    },
    remove: async (key: string) => {
      const resp = await ajaxDelete(`${API_PATH.CONTACT}/data/family/${key}`);
      console.log("delete", resp);
    },
  });
