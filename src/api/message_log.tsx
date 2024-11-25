import {customStore} from "../model/customStore";
import {ajaxGet} from "./http.api";
import {API_PATH} from "./path_url";

export const listStore = customStore({loadUrl: API_PATH.MESSAGE_LOG});
export const getDetail = async (id: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.MESSAGE_LOG}/detail/${id}`);
    return resp.data;
};