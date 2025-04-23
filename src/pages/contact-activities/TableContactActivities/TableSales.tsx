import DataGrid, {
  Column,
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

const TableSales = ({ dataSource }: { dataSource: any }) => {
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
      dataSource={dataSource}
    >
      <MasterDetail enabled={true} component={DetailContactActivity} />
      <Scrolling showScrollbar={"always"} />

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
                  navigate(`/contact/detail?id=${options.data.contactId}`);
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
      <Column dataField={"categoryName"} caption={"Category"} />
      <Column dataField={"typeName"} caption={"Type"} />
      <Column dataField={"resultName"} caption={"Result"} />
      <Column dataField={"purposeCallName"} caption={"Purpose of Call"} />
      <Column dataField={"purposeVisitName"} caption={"Purpose of Visit"} />
      <Column dataField={"salesOfferingName"} caption={"Sales Offering"} />
      <Column dataField={"name"} caption={"Comment"} width={300} />
      <Paging defaultPageSize={50} />
      <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
    </DataGrid>
  );
};

export default TableSales;
