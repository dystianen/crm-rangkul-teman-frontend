import { dataRawCustomStore } from "src/model/datagrid";
import { ajaxGet, ajaxPost } from "./http.api";
import { ICreateNewApplication } from "./types/ICreateNewApplicationRequest";
import { ICreateNewApplicationUpdateStep1 } from "./types/ICreateNewApplicationUpdateStep1Request";
import { ICreateNewApplicationUpdateStep2 } from "./types/ICreateNewApplicationUpdateStep2Request";

const url = (u: string) => {
  return u.replace(`{{host-api}}`, process.env.REACT_APP_BACKEND || "");
};

export const api = {
  create_new_application: (arg: ICreateNewApplication) => {
    return ajaxPost(url(`http://{{host-api}}/api/trx/application/create`), arg);
  },
  create_application_step_1: (
    app_id: string,
    arg: ICreateNewApplicationUpdateStep1
  ) => {
    return ajaxPost(
      url(`http://{{host-api}}/api/trx/application/create/step/1/${app_id}`)
    );
  },
  create_application_step_2: (
    app_id: string,
    arg: ICreateNewApplicationUpdateStep2
  ) => {
    return ajaxPost(
      url(`http://{{host-api}}/api/trx/application/create/step/2/${app_id}`)
    );
  },
  list_application: () => {},
  detail_application: (app_id: string) => {
    return ajaxGet(url(`http://{{host-api}}/api/trx/application/${app_id}`));
  },
  getlistActiveProduct: () => {
    return dataRawCustomStore(`/api/product/list?`);
  },
};
