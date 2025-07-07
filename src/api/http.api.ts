/* eslint-disable no-restricted-globals */
import axios, { AxiosRequestConfig } from "axios";
import { ApiError } from "./ApiError";
import { readToken } from "../utils/localStorage.util";
import qs from "qs";

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  responseType: "json",
  timeout: 3000000,
  withCredentials: false,
});

httpApi.interceptors.request.use((config: any) => {
  config.headers = { ...config.headers };
  if (readToken()) {
    config.headers.Authorization = `Bearer ${readToken()}`;
  }
  return config;
});

httpApi.interceptors.response.use(undefined, (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      localStorage.clear();
      window.location.href = document.URL;
    }
  }
  throw new ApiError<ApiErrorData>(
    error.response?.data.message || error.message,
    error.response?.data
  );
});

function emptyCache() {
  if ("caches" in window) {
    caches.keys().then((names: string[]) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    localStorage.clear();
  }
}

export interface ApiErrorData {
  message: string;
}

export const ajaxPostLogin = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.post(url, data, config);
  return response.data;
};

export const downloadExcel = async (apiUrl:string, params: any) => {
  const res = await ajaxGet(`${apiUrl}/download/excel?${qs.stringify(params)}`, {
    responseType: 'blob',
  });
  console.log("data ", res)
  return res;
};
export const ajaxPost = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.post(url, data, config);
  return response.data;
};

export const ajaxGetBody = async function (
  url: string,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.get(url, config);
  return response;
};

export const ajaxGet = async function (
  url: string,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.get(url, config);
  return response.data;
};

export const ajaxPatch = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.patch(url, data, config);
  return response.data;
};

export const ajaxPut = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.put(url, data, config);
  return response.data;
};

export const ajaxDelete = async function (
  url: string,
  config?: AxiosRequestConfig
): Promise<any> {
  const response = await httpApi.delete(url, config);
  return response.data;
};

export const ajaxPostViaFormContentType = async function (
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> {
  data = qs.stringify(data);
  const response = await httpApi.post(url, data, config);
  return response.data;
};

export const configMultipart = {
  headers: {
    "content-type": "multipart/form-data",
  },
};
