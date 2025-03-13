import {ajaxGet, ajaxPost} from "./http.api";
import {dataRawCustomStore} from "../model/datagrid";
import {customStore} from "../model/customStore";

export const restructureV2ListStore = customStore({ loadUrl: "/api/trx/contract/restructure/v2" });
export const frequencyStore = dataRawCustomStore(`/api/trx/contract/restructure/v2/frequency?`);

export const calc = async (payload: any): Promise<any> => {
    const resp = await ajaxPost(`/api/trx/contract/restructure/calc`, payload);
    return resp.data;
};

export const submit = async (payload: any): Promise<any> => {
    const resp = await ajaxPost(`/api/trx/contract/restructure/submit`, payload);
    return resp.data;
};

export const getDetail = async (id: any): Promise<any> => {
    const resp = await ajaxGet(`/api/trx/contract/restructure/v2/detail/${id}`);
    return resp.data;
};

export const getActivity = async (id: any): Promise<any> => {
    const resp = await ajaxGet(`/api/trx/contract/restructure/v2/activity/${id}`);
    return resp.data;
};

export const approve = async (id: any, payload: any): Promise<any> => {
    const resp = await ajaxPost(`/api/trx/contract/restructure/v2/approve/${id}`, payload);
    return resp.data;
};

export const reject = async (id: any, payload: any): Promise<any> => {
    const resp = await ajaxPost(`/api/trx/contract/restructure/v2/reject/${id}`, payload);
    return resp.data;
};