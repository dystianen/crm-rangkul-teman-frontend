import {ajaxGet, ajaxPatch, ajaxPost} from "./http.api";
import {API_PATH} from "./path_url";

export const getRenew = async (token: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.SAVING_DEPOSIT}/public/app/renew/${token}`);
    return resp.data;
};

export const updateRenew = async (token: string, data: any): Promise<any> => {
    const resp = await ajaxPatch(`${API_PATH.SAVING_DEPOSIT}/public/app/renew/${token}`, data);
    return resp.data;
};

export const submitRenew = async (token: string, data: any): Promise<any> => {
    const resp = await ajaxPost(`${API_PATH.SAVING_DEPOSIT}/public/app/renew/${token}`, data);
    return resp.data;
};