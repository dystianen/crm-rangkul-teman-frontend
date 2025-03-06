import {appFilesStore} from "../../api/approval1";
import DataGrid,{Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {filterOperation} from "../../constants/FilterOperation";
import React, {FC} from "react";
import ReactDOM from "react-dom/client";
import ButtonDoc from "../../components/doc-viewer/ButtonDoc";

export const ApplicationFiles: FC<any> = ({id}) => {
    return <>
        <div className="dx-form-group-with-caption mb14">
            <span className="dx-form-group-caption">File Pengajuan</span>
        </div>
        <DataGrid
            dataSource={appFilesStore(String(id))}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
        >
            <Scrolling rowRenderingMode='virtual' columnRenderingMode="virtual"></Scrolling>
            <Column alignment={"center"} dataField={"seqId"} caption={"No."} width={100} sortOrder={"asc"}/>
            <Column
                dataField={'createdOn'}
                caption={'Tanggal Dibuat'}
                dataType={'date'}
                format={'dd MMM yyyy HH:mm:ss'}
                width={200}
                calculateFilterExpression={function (
                    value: any,
                    selectedFilterOperations: any,
                    target: any,
                ) {
                    const column = this as any;
                    return column.defaultCalculateFilterExpression.apply(this, [
                        new Date(value),
                        selectedFilterOperations,
                        target,
                    ]);
                }}
                filterOperations={filterOperation.date}
            />
            <Column
                dataField={'modifiedOn'}
                caption={'Tanggal Diubah'}
                dataType={'date'}
                format={'dd MMM yyyy HH:mm:ss'}
                width={200}
                calculateFilterExpression={function (
                    value: any,
                    selectedFilterOperations: any,
                    target: any,
                ) {
                    const column = this as any;
                    return column.defaultCalculateFilterExpression.apply(this, [
                        new Date(value),
                        selectedFilterOperations,
                        target,
                    ]);
                }}
                filterOperations={filterOperation.date}
            />
            <Column
                dataField={"name"}
                caption={"Nama file"}
                cellTemplate={function (container: any, options: any) {
                    const dom = ReactDOM.createRoot(container);
                    dom.render(<ButtonDoc
                        fileUrl={options.data?.urlPath}
                        fileName={options.data?.name}
                    />);
                }}
            />
            <Column dataField={"typeName"} caption={"Tipe"}/>
            <Paging defaultPageSize={50}/>
            <Pager
                showPageSizeSelector={true}
                showInfo={true}
                allowedPageSizes={[10, 50, 100]}
            />
        </DataGrid>
    </>
}