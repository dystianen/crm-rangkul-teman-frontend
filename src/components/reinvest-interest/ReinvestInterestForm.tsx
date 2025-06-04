import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import queryString from "query-string";
import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectBoxOptions } from "src/api/contact";
import {listPublicProductApplicationTerm} from "src/api/saving";
import {notifyError, notifySuccess} from "src/utils/devExtremeUtils";
import {getRenew, submitRenew, updateRenew} from "../../api/reinvest.api";

interface FormValues {
  id?: string;
  totalAmount: number;
  amount: number;
  accrualInterest: number;
  apr?: number;
  termMonth?: number;
  isWithInterest: boolean;
  renewFromAppId?: string;
  renewFromContractId?: string;
}

export const ReinvestInterestForm: FC = () => {
  const formRef = useRef<Form>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = queryString.parse(location.search);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    isWithInterest: false, amount: 0, accrualInterest: 0, totalAmount: 0
  });

  useEffect(() => {
    if (token == null) {
      notifyError("Not valid token");
      navigate("/login");
      return;
    }

    getRenew(token as string).then(setFormData);

  }, []);

  const savingTermOptions = {...selectBoxOptions(
        new DataSource(listPublicProductApplicationTerm),
        "Select product saving term"
    ), showClearButton: false, onValueChanged: (evt: any)=>{
      if(evt.previousValue){
        updateRenew({
          ...formData,
          termMonth: evt.value,
        }).then(setFormData);
      }
    }};

  const onChangeInterest = (evt: any)=>{
    updateRenew({
      ...formData,
      isWithInterest: evt.value,
    }).then(setFormData);
  }

  return (<>
      <Form
        ref={formRef}
        formData={formData}
        colCount={1}
        showColonAfterLabel
        showValidationSummary={false}
        validationGroup="reinvestValidationForm"
      >
        <GroupItem colCount={1}>
          <SimpleItem
            dataField="totalAmount"
            label={{ text: "Jumlah Simpanan" }}
            editorType="dxNumberBox"
            editorOptions={{
              format: "Rp #,##0.00",
              readOnly: true
            }}
          />
          <SimpleItem
            dataField="termMonth"
            editorType="dxSelectBox"
            label={{ text: "Jangka Waktu" }}
            editorOptions={{ ...savingTermOptions }}
          />
          <SimpleItem
            dataField="apr"
            label={{ text: "Bunga" }}
            editorOptions={{ readOnly: true }}
          />
          <SimpleItem
            dataField="isWithInterest"
            label={{ text: "Jumlah Simpanan + Bunga" }}
            editorType={"dxRadioGroup"}
            editorOptions={{
              items: [
                { label: "Ya", value: true },
                { label: "Tidak", value: false }
              ],
              layout:"horizontal",
              displayExpr:"label",
              valueExpr:"value",
              onValueChanged: onChangeInterest
            }}
          />
        </GroupItem>
      </Form>
</>);
};
