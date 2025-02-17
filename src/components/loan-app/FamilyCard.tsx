import { RequiredRule, SimpleItem } from "devextreme-react/cjs/form";
import DataGrid, {
  Column,
  Editing,
  Form as FormGrid,
  Lookup,
  Pager,
  Paging,
  Popup as PopGrid
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import ReactDOM from "react-dom/client";
import { familyListStore } from "src/api/apploan";
import { contactRelativeStore, selectBoxOptions } from "src/api/contact";

const FamilyCard = ({ appId }: { appId: string }) => {
  const relativeOptions = selectBoxOptions(new DataSource(contactRelativeStore), "Select Relation");

  return (
    <div className={"dx-card responsive-paddings"}>
      <h3>Family</h3>
      <DataGrid
        dataSource={new DataSource(familyListStore(appId))}
        columnAutoWidth={true}
        wordWrapEnabled={false}
        showBorders={true}
        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
        repaintChangesOnly={true}
        onRowUpdating={(options: any) => {
          options.newData = {
            ...options.oldData,
            ...options.newData,
        }
        }}
      >
        <Editing mode="popup" allowUpdating={true} allowAdding={true}>
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
                onKeyDown: (e: any) => {
                  const key = e.event.key;
                  e.value = String.fromCharCode(e.event.keyCode);
                  if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                    e.event.preventDefault();
                }
              }}
            >
              <RequiredRule message="NIK is required" />
            </SimpleItem>
            <SimpleItem dataField="name">
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
          cellTemplate={function (container: any, options: any) {
            const dom = ReactDOM.createRoot(container);
            dom.render(options.rowIndex + 1);
          }}
        />
        <Column dataField={"idNumber"} caption={"NIK"} />
        <Column dataField={"name"} caption={"Name"} />
        <Column dataField={"typeId"} caption={"Relation Type"}>
          <Lookup dataSource={contactRelativeStore} displayExpr="name" valueExpr="id" />
        </Column>
        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </div>
  );
};

export default FamilyCard;
