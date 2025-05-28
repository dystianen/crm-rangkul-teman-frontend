import { LoadIndicator, RadioGroup } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import { FieldDataChangedEvent } from "devextreme/ui/form";
import queryString from "query-string";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectBoxOptions } from "src/api/contact";
import {listProductApplicationTerm, listPublicProductApplicationTerm} from "src/api/saving";
import {notifyError, notifySuccess} from "src/utils/devExtremeUtils";
import {getRenew, submitRenew, updateRenew} from "../../api/reinvest.api";

interface FormValues {
  id?: string;
  totalAmount: number;
  amount: number;
  accrualInterest: number;
  apr?: number;
  termMonth?: number;
  isWithInterest?: boolean;
  renewFromAppId?: string;
  renewFromContractId?: string;
}

interface RadioGroupCellProps {
  dataField: keyof FormValues;
  value: boolean | null;
  onChange: (field: keyof FormValues, value: boolean) => void;
}

const RadioGroupCell: FC<RadioGroupCellProps> = memo(({ dataField, value, onChange }) => (
  <RadioGroup
    items={[
      { label: "Ya", value: true },
      { label: "Tidak", value: false }
    ]}
    value={value}
    layout="horizontal"
    displayExpr="label"
    valueExpr="value"
    onValueChanged={(e) => onChange(dataField, e.value)}
  />
));

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

    getRenew(token as string).then(rs=>{
      setFormData({...rs, totalAmount: rs.amount});
    });

  }, []);

  const savingTermOptions = selectBoxOptions(
    new DataSource(listPublicProductApplicationTerm),
    "Select product saving term"
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Handle API call here
    submitRenew(token as string, {...formData, amount: formData.totalAmount})
        .then(rs=> notifySuccess("Terima kasih telah mempercayakan simpanan Anda di KSP Rangkul Teman Jakarta"))
        .catch(err=> notifyError(err.message));
    setLoading(true);
  };

  const updateFormData = (field: keyof FormValues, value: any) => {
    if("isWithInterest"==field){
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        totalAmount: (value==true) ? (prev.amount + prev.accrualInterest): prev.amount
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Form
        ref={formRef}
        formData={formData}
        colCount={1}
        showColonAfterLabel
        showValidationSummary={false}
        validationGroup="rejectApp"
        onFieldDataChanged={(e: FieldDataChangedEvent) => {
          updateFormData(e.dataField as keyof FormValues, e.value);
        }}
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
            render={() => (
              <RadioGroupCell
                dataField="isWithInterest"
                value={formData.isWithInterest ?? false}
                onChange={updateFormData}
              />
            )}
          />
        </GroupItem>
        <ButtonItem horizontalAlignment="left">
          <ButtonOptions type="default" width="100%" disabled={loading} useSubmitBehavior>
            <div className="button-options">
              <LoadIndicator width="20px" height="20px" visible={loading} />
              <span className="dx-button-text">Submit</span>
            </div>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>
  );
};
