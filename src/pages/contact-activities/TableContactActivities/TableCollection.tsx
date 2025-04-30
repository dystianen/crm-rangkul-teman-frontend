import DataGrid, {
    Column, FilterRow,
    MasterDetail,
    Pager,
    Paging,
    Scrolling
} from "devextreme-react/data-grid";
import "devextreme-react/file-uploader";
import "devextreme-react/text-area";
import "devextreme/data/odata/store";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { OnClickLink } from "src/components/alink";
import { filterOperation } from "../../../constants/FilterOperation";
import DetailContactActivity from "../DetailContactActivity";
import React from "react";
import {activityByCategoryStore} from "../../../api/contact";

const TableCollection = ({ categoryId }: { categoryId: string }) => {
  const navigate = useNavigate();

  return (
    <DataGrid
      remoteOperations={true}
      columnAutoWidth={true}
      wordWrapEnabled={true}
      focusedRowEnabled={true}
      showBorders={true}
      cacheEnabled={false}
      dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
      repaintChangesOnly={true}
      dataSource={activityByCategoryStore(categoryId)}
    >
      <MasterDetail enabled={true} component={DetailContactActivity} />
      <Scrolling showScrollbar={"always"} />
      <FilterRow visible={true}/>

      <Column
        alignment={"center"}
        dataField={"contactSeq"}
        caption={"#NO"}
        width={90}
        cellTemplate={function (container: any, options: any) {
          const dom = ReactDOM.createRoot(container);
          dom.render(
            <OnClickLink
              onClick={() => {
                if (options.data.contactType === "contact") {
                  navigate(`/contact/edit?id=${options.data.contactId}&from=contact-activities`);
                } else {
                  navigate(`/contact/leads/edit?id=${options.data.contactId}`);
                }
              }}
            >
              {options.data.contactSeq}
            </OnClickLink>
          );
        }}
        filterOperations={filterOperation.numeric}
      />

      <Column dataField={"modifiedByName"} caption={"Modified By"} />
      <Column
        dataField={"modifiedOn"}
        caption={"Modified At"}
        dataType={"date"}
        format={"dd MMM yyyy HH:mm:ss"}
        calculateFilterExpression={(value: any, selectedFilterOperations: any, target: any) => {
          const column = this as any;
          return column.defaultCalculateFilterExpression.apply(this, [
            new Date(value),
            selectedFilterOperations,
            target
          ]);
        }}
        filterOperations={filterOperation.date}
      />
      <Column dataField={"categoryName"} caption={"Category"}
              filterOperations={filterOperation.string} />
      <Column dataField={"typeName"} caption={"Type"}
              filterOperations={filterOperation.string} />
      <Column dataField={"resultName"} caption={"Result"}
              filterOperations={filterOperation.string}
      />
      <Column dataField={"ptpDate"} caption={"PTP Date"} dataType={"date"} format={"dd MMM yyyy"}
              calculateFilterExpression={(
                  value: any,
                  selectedFilterOperations: any,
                  target: any
              ) => {
                  const column = this as any;
                  return column.defaultCalculateFilterExpression.apply(this, [
                      new Date(value),
                      selectedFilterOperations,
                      target,
                  ]);
              }}
              filterOperations={filterOperation.date}
      />
      <Column dataField={"ptpAmount"} caption={"PTP Amount"}
              filterOperations={filterOperation.numeric}
              format="Rp #,##0.00"  />
      <Column dataType={"number"} dataField={"contactType"} caption={"Contact Type"}
              filterOperations={filterOperation.string}/>
      <Column dataField={"contactName"} caption={"Contact Name"}
              filterOperations={filterOperation.string}/>
      <Column dataField={"name"} caption={"Comment"} width={200}
              filterOperations={filterOperation.string}/>
      <Paging defaultPageSize={50} />
      <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
    </DataGrid>
  );
};

export default TableCollection;
