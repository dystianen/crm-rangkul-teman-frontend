import CustomStore from "devextreme/data/custom_store";
import {FilterPss, setFilterPss} from "../interfaces/IFilterPss";
import {ajaxDelete, ajaxGet, ajaxPost, ajaxPut} from "../api/http.api";
import qs from "qs";

interface RequestUrl {
    loadUrl: string;
    insertUrl?: string;
    updateUrl?: string;
    deleteUrl?: string;
}

export const customStore = (request: RequestUrl) =>
    new CustomStore({
        key: "id",
        load: async (loadOptions) => {
            let sort = loadOptions.sort instanceof Array && loadOptions.sort?.map((val: any) => {
                if (val.selector == "id") {
                    return {selector: "modifiedOn", desc: false}
                }
                return val;
            });
            // console.log("loadOptions.filter: %o", loadOptions.filter);
            // console.log("loadOptions.sort: %o", loadOptions.sort);
            // const {sort} = loadOptions;
            const startVal: number | undefined =
                    loadOptions.skip != null ? loadOptions.skip : 0,
                lengthVal: number | undefined =
                    loadOptions.take != null ? loadOptions.take : 50;
            const paramSearch: FilterPss = {
                ...setFilterPss(),
                start: startVal,
                length: lengthVal,
                sort: sort,
                searchQuery: JSON.stringify(loadOptions.filter),
            };
            const resp = await ajaxGet(
                `${request.loadUrl}?${qs.stringify(paramSearch)}`
            );
            // console.log("resp: %o", resp);
            return resp;
        },
        cacheRawData: true,
        insert: async (values: any) => {
            if (request?.insertUrl) {
                const resp = await ajaxPost(request.insertUrl, values);
                console.log("insert", resp);
            }
        },
        update: async (key: string, values: any) => {
            console.log("update", key, values);
            if (request?.updateUrl) {
                const resp = await ajaxPut(`${request.updateUrl}/${key}`, values);
                console.log("update", resp);
            }
        },
        remove: async (key) => {
            if (request?.deleteUrl) {
                const resp = await ajaxDelete(`${request.deleteUrl}/${key}`);
                console.log("delete", resp);
            }
        },
    });

export const customStoreSortFirst = (request: RequestUrl, columnSort: string) =>
    new CustomStore({
        key: "id",
        load: async (loadOptions) => {
            let sort = loadOptions.sort instanceof Array && loadOptions.sort?.map((val: any) => {
                if (val.selector == "id") {
                    return {selector: columnSort, desc: false}
                }
                return val;
            });
            // console.log("loadOptions.filter: %o", loadOptions.filter);
            // console.log("loadOptions.sort: %o", loadOptions.sort);
            // const {sort} = loadOptions;
            const startVal: number | undefined =
                    loadOptions.skip != null ? loadOptions.skip : 0,
                lengthVal: number | undefined =
                    loadOptions.take != null ? loadOptions.take : 50;
            const paramSearch: FilterPss = {
                ...setFilterPss(),
                start: startVal,
                length: lengthVal,
                sort: sort,
                searchQuery: JSON.stringify(loadOptions.filter),
            };
            const resp = await ajaxGet(
                `${request.loadUrl}?${qs.stringify(paramSearch)}`
            );
            // console.log("resp: %o", resp);
            return resp;
        },
        cacheRawData: true,
        insert: async (values: any) => {
            if (request?.insertUrl) {
                const resp = await ajaxPost(request.insertUrl, values);
                console.log("insert", resp);
            }
        },
        update: async (key: string, values: any) => {
            console.log("update", key, values);
            if (request?.updateUrl) {
                const resp = await ajaxPut(`${request.updateUrl}/${key}`, values);
                console.log("update", resp);
            }
        },
        remove: async (key) => {
            if (request?.deleteUrl) {
                const resp = await ajaxDelete(`${request.deleteUrl}/${key}`);
                console.log("delete", resp);
            }
        },
    });
