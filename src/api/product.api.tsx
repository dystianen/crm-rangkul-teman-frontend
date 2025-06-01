import {customStore} from "../model/customStore";
import {API_PATH} from "./path_url";

export const listProductStore = customStore({loadUrl: API_PATH.PRODUCT});
