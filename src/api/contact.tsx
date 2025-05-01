import CustomStore from "devextreme/data/custom_store";
import qs from "qs";
import type {
  TReqCreateLeads,
  TResCheckEkyc,
  TResContactOCR,
  TResInfoEkyc
} from "../interfaces/contactDto";
import { FilterPss, setFilterPss } from "../interfaces/IFilterPss";
import { customStore } from "../model/customStore";
import {dataCustomStore, dataRawCustomStore} from "../model/datagrid";
import { ajaxGet, ajaxPatch, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";

export const contactListStore = customStore({ loadUrl: "/api/contact" });

export const createContact = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`/api/contact/create`, payload);
  return resp.data;
};

export const updateContact = async (id: any, payload: any): Promise<any> => {
  const resp = await ajaxPatch(`/api/contact/update/${id}`, payload);
  return resp.data;
};

export const createLeads = async (payload: TReqCreateLeads): Promise<any> => {
  const resp = await ajaxPost(`/api/contact/leads`, payload);
  return resp.data;
};

export const updateLeads = async (id: string, payload: TReqCreateLeads): Promise<any> => {
  const resp = await ajaxPatch(`/api/contact/leads/${id}`, payload);
  return resp.data;
};

export const createContactLeads = async (id: string, payload: TReqCreateLeads): Promise<any> => {
  const resp = await ajaxPost(`/api/contact/leads/${id}/submit`, payload);
  return resp.data;
};

export const getFile = async (urlPath: string) => {
  const resp = await ajaxGet(`/api/file/get/${urlPath}`);
  return resp;
};

export const genderApi = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/contact/data/gender?`);
  return resp.data;
};

export const religionApi = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/contact/data/religion?`);
  return resp.data;
};

export const educationApi = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/contact/data/education?`);
  return resp.data;
};

export const maritalStatusApi = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/contact/data/maritalStatus?`);
  return resp.data;
};

export const addressOwnershipApi = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/contact/data/addressOwnership?`);
  return resp.data;
};

export const countryApi = async (): Promise<any[]> => {
  const resp = await ajaxGet(`/api/data/country/list?`);
  return resp.data;
};

export const proviceApi = async (country: string): Promise<any[]> => {
  const resp = await ajaxGet(`/api/data/province/${country}`);
  return resp.data;
};

export const cityApi = async (province: string): Promise<any[]> => {
  const resp = await ajaxGet(`/api/data/city/${province}`);
  return resp.data;
};

export const districtApi = async (city: string): Promise<any[]> => {
  const resp = await ajaxGet(`/api/data/district/${city}`);
  return resp.data;
};

export const subDistrictApi = async (district: string): Promise<any[]> => {
  const resp = await ajaxGet(`/api/data/subDistrict/${district}`);
  return resp.data;
};

export const contactDetailApi = async (id: string): Promise<any[]> => {
  const resp = await ajaxGet(`/api/contact/${id}`);
  return resp.data;
};

export const contactCheckEkyc = async (id: string): Promise<TResCheckEkyc> => {
  const resp = await ajaxGet(`/api/contact/ekyc/check/${id}`);
  return resp.data;
};

export const contactEkycInfo = async (id: string): Promise<TResInfoEkyc> => {
  const resp = await ajaxGet(`/api/contact/ekyc/info/${id}`);
  return resp.data;
};

export const findAll = async (paramSearch: any): Promise<any> => {
  const resp = await ajaxGet(`/api/contact/?${qs.stringify(paramSearch)}`);
  return resp.data;
};

export const selectBoxBranchOptions = (data: any, placeholder: string) => {
  return {
    dataSource: data,
    valueExpr: "branchId",
    displayExpr: "branchName",
    placeholder: placeholder,
    showClearButton: true,
    deferRendering: true,
    hoverStateEnabled: true,
    searchEnabled: true
  };
};

export const selectBoxOptions = (data: any, placeholder: string) => {
  return {
    dataSource: data,
    valueExpr: "id",
    displayExpr: "name",
    placeholder: placeholder,
    showClearButton: true,
    deferRendering: true,
    hoverStateEnabled: true,
    searchEnabled: true
  };
};

export const validateIdNumber = async (payload: any) => {
  const resp = await ajaxPost(`/api/contact/check-ktp`, payload);
  return resp?.data;
};

export const validatePhone = async (payload: any) => {
  const resp = await ajaxPost(`/api/contact/check-phone`, payload);
  return resp?.data;
};

export const validateEmail = async (payload: any) => {
  const resp = await ajaxPost(`/api/contact/check-email`, payload);
  return resp?.data;
};

export const processWithoutEkyc = async (payload: {
  contactId: string;
}): Promise<TResCheckEkyc> => {
  const resp = await ajaxPost(`/api/contact/without/ekyc`, payload);
  return resp.data;
};

export const contactOCR = async (payload: {
  contactId: string;
  ktp: string;
}): Promise<TResContactOCR> => {
  const resp = await ajaxPost(`/api/contact/ocr`, payload);
  return resp.data;
};

export const processCancel = async (contactId: string): Promise<any> => {
  const resp = await ajaxGet(`/api/contact/ekyc/cancel/${contactId}`);
  return resp.data;
};


export const activityCategoryStore = dataRawCustomStore(`/api/contact/data/activityCategory?`);
export const activityByCategoryStore = (categoryId: string) => customStore({loadUrl: `/api/contact/activity/category/${categoryId}`});
export const fetchActivityCategory = async (): Promise<any> => {
  const resp = await ajaxGet(`/api/contact/data/activityCategory`);
  return resp.data;
}

export const activityTypeByCategoryStore = (categoryId: any) => dataRawCustomStore(`/api/contact/data/activityType/${categoryId}?`);
export const activityResultByTypeStore = (typeId: any) => dataRawCustomStore(`/api/contact/data/activityResult/${typeId}?`);
export const activityTypeFieldForm = async (typeId: string): Promise<any> => {
  const resp = await ajaxGet(`/api/contact/data/activityFieldForm/${typeId}?`);
  return resp.data;
}
export const activityResultFieldForm = async (resultId: string): Promise<any> => {
  const resp = await ajaxGet(`/api/contact/data/activityFieldFormByResult/${resultId}?`);
  return resp.data;
}

export const activityTypeStore = dataRawCustomStore(`/api/contact/data/activityType?`);
export const activityResultStore = (id: string | null) => {
  if (id == null) {
    return dataRawCustomStore(`/api/contact/data/activityResult?`);
  }
  return dataRawCustomStore(`/api/contact/data/activityResult/${id}?`);
};
export const contactActivityListStore = (id: string) =>
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
      const resp = await ajaxGet(`/api/contact/activity/${id}?${qs.stringify(paramSearch)}`);
      return resp;
    },
    cacheRawData: true
    // insert: async (values: any) => {
    //   const resp = await ajaxPost("/api/contact/activity/create", values);
    //   console.log("insert", resp);
    // },
    // update: async (key: string, values: any) => {
    //   console.log("update", key, values);
    //   if(key.startsWith("_DX_KEY_")){
    //     const resp = await ajaxPost("/api/contact/activity/create", values);
    //     console.log("insert", resp);
    //   } else {
    //     const resp = await ajaxPatch(`/api/contact/activity/update/${key}`, values);
    //     console.log("update", resp);
    //   }
    // }
  });
export const salesChannelStore = dataRawCustomStore(`/api/contact/data/salesChannel?`);
export const contactFamilyStore = dataRawCustomStore(`/api/contact/data/contactFamily?`);
export const contactRelativeStore = dataRawCustomStore(`/api/contact/data/contactRelative?`);
export const genderStore = dataRawCustomStore(`/api/contact/data/gender?`);
export const religionStore = dataRawCustomStore(`/api/contact/data/religion?`);
export const educationStore = dataRawCustomStore(`/api/contact/data/education?`);
export const maritalStatusStore = dataRawCustomStore(`/api/contact/data/maritalStatus?`);
export const countryStore = dataRawCustomStore(`/api/data/country/list?`);
export const addressOwnershipStore = dataRawCustomStore(`/api/contact/data/addressOwnership?`);
export const provinceStore = (countryId: string) =>
  dataRawCustomStore(`/api/data/province/${countryId}?`);
export const cityStore = (provinceId: string) =>
  dataRawCustomStore(`/api/data/city/${provinceId}?`);
export const districtStore = (cityId: string) =>
  dataRawCustomStore(`/api/data/district/${cityId}?`);
export const subDistrictStore = (districtId: string) =>
  dataRawCustomStore(`/api/data/subDistrict/${districtId}?`);

export const salesOfferingStore = dataRawCustomStore(`${API_PATH.CONTACT}/data/salesOffering?`);
export const purposeVisitStore = dataRawCustomStore(`${API_PATH.CONTACT}/data/purposeVisit?`);
export const purposeCallStore = dataRawCustomStore(`${API_PATH.CONTACT}/data/purposeCall?`);
