import { LoadIndicator, RadioGroup } from "devextreme-react";
import Form, { ButtonItem, ButtonOptions, GroupItem, SimpleItem } from "devextreme-react/form";
import DataSource from "devextreme/data/data_source";
import { FieldDataChangedEvent } from "devextreme/ui/form";
import queryString from "query-string";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectBoxOptions } from "src/api/contact";
import { listProductApplicationTerm } from "src/api/saving";
import { notifyError } from "src/utils/devExtremeUtils";

interface FormValues {
  balanceSaving?: number;
  termMonth?: string;
  status?: string;
  isTotalSaving?: boolean;
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
    isTotalSaving: false
  });

  useEffect(() => {
    if (token == null) {
      notifyError("Not valid token");
      navigate("/login");
    }
  }, []);

  const savingTermOptions = selectBoxOptions(
    new DataSource(listProductApplicationTerm),
    "Select product saving term"
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Handle API call here
    setLoading(true);
  };

  const updateFormData = (field: keyof FormValues, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
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
            dataField="balanceSaving"
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
            dataField="status"
            label={{ text: "Bunga" }}
            editorOptions={{ readOnly: true }}
          />
          <SimpleItem
            dataField="isTotalSaving"
            label={{ text: "Jumlah Simpanan + Bunga" }}
            render={() => (
              <RadioGroupCell
                dataField="isTotalSaving"
                value={formData.isTotalSaving ?? false}
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
