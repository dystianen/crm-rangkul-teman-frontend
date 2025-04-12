import CustomStore from 'devextreme/data/custom_store';
import type {FilterPss} from 'src/interfaces/IFilterPss';
import {setFilterPss} from 'src/interfaces/IFilterPss';
import {ajaxGet} from 'src/api/http.api';
import qs from 'qs';

const dataLookUpCustomStore = (url: string) =>
    new CustomStore({
        key: 'id',
        loadMode: 'raw',
        load: async (loadOptions) => {
            const resp = await ajaxGet(`${url}`);
            return resp.data;
        },
    });

const dataCustomStore = (url: string) =>
    new CustomStore({
        key: 'id',
        load: function (loadOptions) {
            const {sort} = loadOptions;
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
            const resp = ajaxGet(`${url}${qs.stringify(paramSearch)}`);
            return resp;
        },
        cacheRawData: true,
    });

const dataRawCustomStore = (url: string) =>
    new CustomStore({
        key: 'id',
        loadMode: 'raw',
        load: async (loadOptions) => {
            const startVal: number | undefined =
                    loadOptions.skip != null ? loadOptions.skip : 0,
                lengthVal: number | undefined =
                    loadOptions.take != null ? loadOptions.take : 50;
            const paramSearch: FilterPss = {
                ...setFilterPss(),
                start: startVal,
                length: lengthVal,
                sort: loadOptions?.sort,
                searchQuery: JSON.stringify(loadOptions.filter),
            };
            const resp = await ajaxGet(`${url}${qs.stringify(paramSearch)}`);
            return resp.data;
        },
    });

const dataCacheRawCustomStore = (url: string) =>
    new CustomStore({
        key: 'id',
        load: function (loadOptions) {
            const startVal: number | undefined =
                    loadOptions.skip != null ? loadOptions.skip : 0,
                lengthVal: number | undefined =
                    loadOptions.take != null ? loadOptions.take : 50;
            const paramSearch: FilterPss = {
                ...setFilterPss(),
                start: startVal,
                length: lengthVal,
                sort: loadOptions?.sort,
                searchQuery: JSON.stringify(loadOptions.filter),
            };
            const resp = ajaxGet(`${url}${qs.stringify(paramSearch)}`);
            return resp;
        },
        loadMode: 'raw',
        cacheRawData: true,
    });
export {
    dataCustomStore,
    dataRawCustomStore,
    dataCacheRawCustomStore,
    dataLookUpCustomStore,
};
