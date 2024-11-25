import {customStore, customStoreSortFirst} from "../model/customStore";
import {ajaxGet} from "./http.api";
import {API_PATH} from "./path_url";

export const listStore = customStoreSortFirst({loadUrl: API_PATH.PAYMENT_SCHEDULE}, "flag");
export const getDetail = async (id: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.PAYMENT_SCHEDULE}/detail/${id}`);
    return resp.data;
};