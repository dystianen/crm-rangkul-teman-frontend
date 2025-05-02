import React, {FC, useRef} from "react";
import {useNavigate} from "react-router";
import DataGrid, {Column, FilterRow, Item, Pager, Paging, Scrolling, Toolbar} from "devextreme-react/data-grid";
import {Button} from "devextreme-react/button";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../../components/alink";
import {filterOperation} from "../../../constants/FilterOperation";
import {listUserStore} from "../../../api/user.api";
import {calculateFilterExpressionCustom} from "../../../utils/devExtremeUtils";


export const UserListPage: FC = () => {
  const navigate = useNavigate();
  
  const dataGrid: any = useRef();
  
  return <>
    <div className={"content-block"}>
      <h2>Pengguna</h2>
      <div className={"dx-card"}>
        <DataGrid
            ref={dataGrid}
            dataSource={listUserStore}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={false}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
        >
          <Toolbar>
            <Item location="after">
              <Button
                  text="Buat Pengguna"
                  type="default"
                  stylingMode="contained"
                  onClick={()=>navigate("/backoffice/user/create")}
              />
            </Item>
          </Toolbar>
          <Scrolling showScrollbar={"always"} />
          <FilterRow visible={true} />
          <Column
              alignment={"center"}
              dataField={"seqId"}
              caption={"#NO"}
              width={90}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                    <OnClickLink
                        onClick={() => {
                          navigate(`/backoffice/user/update?id=${options.data.id}`);
                        }}
                    >
                      {options.data.seqId}
                    </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
          />
          
          <Column
              dataField="createdOn"
              caption="Tanggal Dibuat"
              dataType="date"
              format="dd MMM yyyy HH:mm:ss"
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
          />
          
          <Column
              dataField={"modifiedOn"}
              caption={"Tanggal Diubah"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
          />
          <Column
              dataField={"name"}
              caption={"Username"}
              width={190}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"contactName"}
              caption={"Name"}
              width={190}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"contactPhoneNumber"}
              caption={"No. HP"}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"contactEmail"}
              caption={"Email"}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"isActive"}
              caption={"Active"}
              filterOperations={filterOperation.boolean}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                const active = options.data.isActive ? "true" : "false";
                dom.render(active);
              }}
          />
          <Column
              dataField={"lastLogin"}
              caption={"Last Login"}
              dataType="date"
              format="dd MMM yyyy HH:mm:ss"
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
          />
          <Column
              dataField={"modifiedByName"}
              caption={"Diubah oleh"}
              filterOperations={filterOperation.string}
          />
          <Paging defaultPageSize={50} />
          <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
        </DataGrid>
      </div>
    </div>
  </>
}
