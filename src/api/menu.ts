import {ajaxGet} from "./http.api";
import {API_PATH} from "./path_url";

export async function getUserMenu() {
    const res = await ajaxGet(API_PATH.USER_MENU);
    if (res?.data instanceof Array) return res?.data.map((val:any)=>{
        if(val?.items) {
            return {...val, expanded: true};
        }
        return val;
    });
    return res?.data ? res?.data : [];
}