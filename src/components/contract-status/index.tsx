import {FC} from "react";

import "./index.scss";

export const ContractStatus: FC<any> = (props) => {

  return <div className={`status status-app status-${props.text.replaceAll(" ","")?.toLowerCase()}`}>
    <span>{props.text}</span>
  </div>
}