import qs from "qs";
import { customStore } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxGet, ajaxPatch, ajaxPost } from "./http.api";

export const contactListStore = customStore({ loadUrl: "/api/contact" });

export const createContact = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`/api/contact/create`, payload);
  return resp.data;
};

export const updateContact = async (id: any, payload: any): Promise<any> => {
  const resp = await ajaxPatch(`/api/contact/update/${id}`, payload);
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

export const contactCheckEkyc = async (id: string): Promise<boolean> => {
  const resp = await ajaxGet(`/api/contact/ekyc/check/${id}`);
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
