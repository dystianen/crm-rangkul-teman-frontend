import DataGrid, { Column, Pager, Paging, Scrolling } from "devextreme-react/data-grid";
import { FC } from "react";
import ReactDOM from "react-dom/client";
import { listSavingContractDocumentStore } from "src/api/saving";
import { calculateFilterExpressionCustom } from "src/utils/devExtremeUtils";
import ButtonDoc from "../../components/doc-viewer/ButtonDoc";
import { filterOperation } from "../../constants/FilterOperation";

type TProps = {
  id: string;
};

export const ContractDocument: FC<TProps> = ({ id }) => {
  return (
    <>
      <div className="dx-form-group-with-caption mb14">
        <span className="dx-form-group-caption">File Perjanjian</span>
      </div>
      <DataGrid
        dataSource={listSavingContractDocumentStore(id)}
        focusedRowEnabled={true}
        remoteOperations={true}
        columnAutoWidth={true}
        wordWrapEnabled={false}
        showBorders={true}
        dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
        repaintChangesOnly={true}
      >
        <Scrolling rowRenderingMode="virtual" columnRenderingMode="virtual"></Scrolling>
        <Column
          alignment={"center"}
          dataField={"seqId"}
          caption={"No."}
          width={100}
          sortOrder={"asc"}
        />
        <Column
          dataField={"createdOn"}
          caption={"Tanggal Dibuat"}
          dataType={"date"}
          format={"dd MMM yyyy HH:mm:ss"}
          width={200}
          calculateFilterExpression={calculateFilterExpressionCustom}
          filterOperations={filterOperation.date}
        />
        <Column
          dataField={"modifiedOn"}
          caption={"Tanggal Diubah"}
          dataType={"date"}
          format={"dd MMM yyyy HH:mm:ss"}
          width={200}
          calculateFilterExpression={calculateFilterExpressionCustom}
          filterOperations={filterOperation.date}
        />
        <Column
          dataField={"name"}
          caption={"Nama file"}
          cellTemplate={function (container: any, options: any) {
            const dom = ReactDOM.createRoot(container);
            dom.render(<ButtonDoc fileUrl={options.data?.urlPath} fileName={options.data?.name} />);
          }}
        />
        <Column dataField={"typeName"} caption={"Tipe"} />
        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </>
  );
};
