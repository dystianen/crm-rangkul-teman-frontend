import { ajaxGet, ajaxPost } from "./http.api";
import { API_PATH } from "./path_url";

export const getMessage = async (phoneNumber: string): Promise<any[]> => {
  const resp = await ajaxGet(`${API_PATH.MESSAGE_WHATSAPP}/${phoneNumber}`);
  return resp.data;
};

export const uploadFile = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.MESSAGE_WHATSAPP}/file/upload`, payload);
  return resp.data;
};

export const sendMessageFile = async (fileType: string, payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.MESSAGE_WHATSAPP}/${fileType}`, payload);
  return resp.data;
};

export const sendMessageText = async (payload: any): Promise<any> => {
  const resp = await ajaxPost(`${API_PATH.MESSAGE_WHATSAPP}/text`, payload);
  return resp.data;
};

export const getMessageDetail = async (id: string): Promise<any> => {
  const resp = await ajaxGet(`${API_PATH.MESSAGE_WHATSAPP}/detail/${id}`);
  return resp.data;
};

export const getReceiver = async (): Promise<any[]> => {
  const resp = await ajaxGet(`${API_PATH.MESSAGE_RECEIVER}`);
  return resp.data;
};

export const getMessageProfile = async (
  id: string
): Promise<{ buttons: string[]; contactId: string }> => {
  const resp = await ajaxGet(`${API_PATH.MESSAGE_WHATSAPP}/profile/${id}`);
  return resp.data;
};
