import { customStore } from "../model/customStore";
import { dataRawCustomStore } from "../model/datagrid";
import { ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";
import {
  TReqSavingAppCreate,
  TReqSavingSubmit,
  TResSavingAppCreate,
  TResSavingSubmit
} from "./types/ISavingDeposit";

export const listProductDepositStore = customStore({ loadUrl: `${API_PATH.SAVING_DEPOSIT}/app` });

export const listProductDeposit = dataRawCustomStore(`${API_PATH.SAVING_DEPOSIT}/product/deposit?`);

export const listProductDepositTerm = dataRawCustomStore(
  `${API_PATH.SAVING_DEPOSIT}/product/deposit/term?`
);

export const createSavingDeposit = async (
  payload: TReqSavingAppCreate
): Promise<TResSavingAppCreate> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/app/create`, payload);
  return resp.data;
};

export const submitSavingDeposit = async (payload: TReqSavingSubmit): Promise<TResSavingSubmit> => {
  const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/app/create`, payload);
  return resp.data;
};
