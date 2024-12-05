import {dataRawCustomStore} from "../model/datagrid";
import {ajaxGet, ajaxPost} from "./http.api";
import {customStore} from "../model/customStore";
import {AxiosRequestConfig} from "axios";
import {API_PATH} from "./path_url";

export const appLoanListStore = customStore({
    loadUrl: API_PATH.APPLICATION,
});

export const appLoanDetailApi = async (id: string): Promise<any[]> => {
    const resp = await ajaxGet(`${API_PATH.APPLICATION}/detail/${id}`);
    return resp.data;
};

export const appLoanDetailActivityApi = async (id: string): Promise<any[]> => {
    const resp = await ajaxGet(`${API_PATH.APPLICATION}/activity/${id}`);
    return resp.data;
};

export const getFile = async (urlPath: string, config?: AxiosRequestConfig) => {
    const resp = await ajaxGet(`/api/file/get/${urlPath}`, config);
    return resp;
};

export const getActiveProduct = async (): Promise<any[]> => {
    const resp = await ajaxGet(`/api/product/list?`);
    return resp.data;
};

export const createAppLoanOnboarding = async (payload: any): Promise<any> => {
    const resp = await ajaxPost(`${API_PATH.APPLICATION}/create`, payload);
    return resp.data;
};

export const submitAppLoan = async (id: string): Promise<any> => {
    const resp = await ajaxPost(`${API_PATH.APPLICATION}/submit/${id}`);
    return resp.data;
};

export const checkAccess = async (accessId: string): Promise<boolean> => {
    const resp = await ajaxGet(`${API_PATH.PROFILE_ACCESS}/${accessId}`);
    return resp;
};

export const getUnsignedDoc = async (id: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.APPLICATION}/get/unsigned/${id}`);
    return resp.data;
}

export const createAppLoanOnboardingStep1 = async (
    appId: string,
    payload: any
): Promise<any> => {
    const resp = await ajaxPost(
        `${API_PATH.APPLICATION}/create/step/1/${appId}`,
        payload
    );
    return resp.data;
};

export const createAppLoanOnboardingStep2 = async (
    appId: string,
    payload: any
): Promise<any> => {
    const resp = await ajaxPost(
        `${API_PATH.APPLICATION}/create/step/2/${appId}`,
        payload
    );
    return resp.data;
};

export const submitAppLoanSignedDocument = async (
    appId: string,
    payload: any
): Promise<any> => {
    const resp = await ajaxPost(
        `${API_PATH.APPLICATION}/submit/signed/${appId}`,
        payload
    );
    return resp.data;
};

export const detailAppStep = async (id: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.APPLICATION}/get/step/${id}`);
    return resp.data;
};

export const detailAppLoan = async (id: string): Promise<any> => {
    const resp = await ajaxGet(`${API_PATH.APPLICATION}/preview/${id}`);
    return resp.data;
};

export const getActiveBranchByUserStore=  dataRawCustomStore(`/api/data/branch/user?`);

export const getActiveProductByBranch = (branchId: string) =>
    dataRawCustomStore(`/api/product/${branchId}?`);

export const getActiveProductStore = dataRawCustomStore(`/api/product/list?`);

export const loanTermStore = (appId: string) =>
    dataRawCustomStore(`/api/product/term/list/app/${appId}?`);
export const getListBank = dataRawCustomStore(`/api/data/bank/list?`);
export const getLoanPurpose = dataRawCustomStore(
    `/api/data/loan/purpose/list?`
);
