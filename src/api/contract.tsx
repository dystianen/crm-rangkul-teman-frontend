import {customStore} from "../model/customStore";
import {ajaxGet, ajaxPost} from "./http.api";
import {API_PATH} from "./path_url";
import {dataRawCustomStore} from "../model/datagrid";

export const listStore = customStore({loadUrl: API_PATH.CONTRACT});
export const getDetail = async (id: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.CONTRACT}/detail/${id}`);
    const {appId} = resp.data;

    const respApp = await ajaxGet(`${API_PATH.APPLICATION}/detail/${appId}`);
    return {app: respApp.data, contract: resp.data};
};

export const contractActivityApi = async (id: string): Promise<any[]> => {
    const resp = await ajaxGet(`${API_PATH.CONTRACT}/activity/${id}`);
    return resp.data;
};

export const submitRestructure = async (payload: any): Promise<any> => {
    const resp = await ajaxPost(`${API_PATH.CONTRACT}/restructure`, payload);
    return resp.data;
}

export const listScheduleStore = (id: string) => dataRawCustomStore(`${API_PATH.CONTRACT}/schedule/${id}?`);
export const listScheduleDetailStore = (id: string) => dataRawCustomStore(`${API_PATH.CONTRACT}/schedule/detail/${id}?`);
export const appFilesStore = (id: string) => dataRawCustomStore(`/api/trx/contract/files/${id}?`);
