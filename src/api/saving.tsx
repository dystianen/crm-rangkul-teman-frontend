import { customStore } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxGet, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";
import {
  TReqResSavingSubmit,
  TReqSavingAppCreate,
  TResSavingAppCreate,
  TResSavingSubmit
} from "./types/ISaving";

export const listProductApplicationStore = customStore({
  loadUrl: `${API_PATH.SAVING_DEPOSIT}/app`
});

export const listProductApplication = dataRawCustomStore(
  `${API_PATH.SAVING_DEPOSIT}/product/deposit?`
);

export const listProductApplicationTerm = dataRawCustomStore(
  `${API_PATH.SAVING_DEPOSIT}/product/deposit/term?`
);

export const createSavingApplication = async (
  payload: TReqSavingAppCreate
): Promise<TResSavingAppCreate> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/app/create`, payload);
  return resp.data;
};

export const submitSavingApplication = async (
  payload: TReqResSavingSubmit
): Promise<TResSavingSubmit> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/app/submit`, payload);
  return resp.data;
};

export const getDetailSavingApplication = async (
  savingId: string
): Promise<TReqResSavingSubmit> => {
  const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/app/${savingId}`);
  return resp.data;
};
