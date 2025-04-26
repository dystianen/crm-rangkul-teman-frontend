import { RequiredRule, SimpleItem } from "devextreme-react/cjs/form";
import DataGrid, {
  AsyncRule,
  Column,
  Editing,
  Form as FormGrid,
  Lookup,
  Pager,
  Paging,
  Popup as PopGrid
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { useMemo } from "react";
import { familyListStore } from "src/api/apploan";
import { contactFamilyStore, selectBoxOptions, validateIdNumber } from "src/api/contact";
import { allowOnlyNumbers, allowOnlyText } from "src/utils/helpers";

const FamilyCard = ({ appId, disabled = false }: { appId: string; disabled?: boolean }) => {
  const familyDataSource = useMemo(() => new DataSource(familyListStore(appId)), [appId]);
  const relativeOptions = useMemo(
    () => selectBoxOptions(new DataSource(contactFamilyStore), "Select Relation"),
    []
  );

  const asyncValidationIdNumber = (params: any) => {
    const request = {
      idNumber: params.value,
      contactId: ""
    };
    return validateIdNumber(request);
  };

  return (
    <>
      <div className={`dx-form-group-with-caption ${disabled ? "mb14" : ""}`}>
        <span className="dx-form-group-caption">Family</span>
      </div>
      <DataGrid
        loadPanel={{ enabled: false }}
        dataSource={familyDataSource}
        columnAutoWidth={true}
        wordWrapEnabled={false}
        showBorders={true}
        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
        repaintChangesOnly={true}
        onRowUpdating={(options: any) => {
          options.newData = {
            ...options.oldData,
            ...options.newData
          };
        }}
      >
        <Editing
          mode="popup"
          allowUpdating={!disabled}
          allowAdding={!disabled}
          allowDeleting={!disabled}
        >
          <PopGrid title="Family Form" showTitle={true} width={360} height={320} />
          <FormGrid
            showColonAfterLabel={true}
            showValidationSummary={true}
            validationGroup="familyData"
            colCount={1}
          >
            <SimpleItem
              dataField="idNumber"
              editorOptions={{
                min: 16,
                maxLength: 16,
                onKeyDown: (e: any) => allowOnlyNumbers(e.event)
              }}
            >
              <RequiredRule message="NIK is required" />
              <AsyncRule
                message="NIK already registered"
                validationCallback={asyncValidationIdNumber}
              />
            </SimpleItem>
            <SimpleItem
              dataField="name"
              editorOptions={{
                onKeyDown: (e: any) => allowOnlyText(e.event)
              }}
            >
              <RequiredRule message="Name is required" />
            </SimpleItem>
            <SimpleItem
              dataField={"typeId"}
              editorType="dxSelectBox"
              editorOptions={relativeOptions}
            >
              <RequiredRule message="Relation type is required" />
            </SimpleItem>
          </FormGrid>
        </Editing>
        <Column
          caption={"No."}
          width={70}
          alignment={"center"}
          cellTemplate={(container, options) => {
            container.innerText = options.rowIndex + 1;
          }}
        />
        <Column dataField={"idNumber"} caption={"NIK"} />
        <Column dataField={"name"} caption={"Name"} />
        <Column dataField={"typeId"} caption={"Relation Type"}>
          <Lookup dataSource={contactFamilyStore} displayExpr="name" valueExpr="id" />
        </Column>
        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </>
  );
};

export default FamilyCard;
