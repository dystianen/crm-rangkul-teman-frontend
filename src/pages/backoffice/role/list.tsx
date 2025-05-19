import {listUserStore} from "../../../api/user.api";
import DataGrid, {Column, FilterRow, Item, Pager, Paging, Scrolling, Toolbar} from "devextreme-react/data-grid";
import {Button} from "devextreme-react/button";
import React, {FC, useRef} from "react";
import {useNavigate} from "react-router";
import {listRoleStore} from "../../../api/role.api";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../../components/alink";
import {filterOperation} from "../../../constants/FilterOperation";
import {calculateFilterExpressionCustom} from "../../../utils/devExtremeUtils";


export const RoleListPage: FC = () => {
  const dataGrid: any = useRef();
  const navigate = useNavigate();
  
  return <>
	<div className={"content-block"}>
	  <h2>Peran Pengguna</h2>
	  <div className={"dx-card"}>
		<DataGrid
			ref={dataGrid}
			dataSource={listRoleStore}
			focusedRowEnabled={true}
			remoteOperations={true}
			columnAutoWidth={true}
			wordWrapEnabled={true}
			showBorders={true}
			dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
			repaintChangesOnly={true}
		>
		  <Toolbar>
			<Item location="after">
			  <Button
				  text="Buat Peran"
				  type="success"
				  stylingMode="contained"
				  onClick={()=>navigate("/backoffice/role/create")}
			  />
			</Item>
		  </Toolbar>
		  <Scrolling showScrollbar={"always"}/>
			<FilterRow visible={true} />
		  <Column
			  alignment={"center"}
			  dataField={"seqId"}
			  caption={"#NO"}
			  width={50}
			  cellTemplate={function (container: any, options: any) {
				const dom = ReactDOM.createRoot(container);
				dom.render(
					<OnClickLink
						onClick={() => {
						  navigate(`/backoffice/role/update?id=${options.data.id}`);
						}}
					>
					  {options.data.seqId}
					</OnClickLink>
				);
			  }}
			  filterOperations={filterOperation.numeric}
		  />

			<Column
				dataField={"createdByName"}
				caption={"Dibuat oleh"}
				filterOperations={filterOperation.string}
			/>
			<Column
				width={100}
				dataField={"createdOn"}
				caption={"Tanggal Dibuat"}
				dataType={"date"}
				format={"dd MMM yyyy HH:mm:ss"}
				calculateFilterExpression={calculateFilterExpressionCustom}
				filterOperations={filterOperation.date}
			/>
			<Column
				dataField={"modifiedByName"}
				caption={"Diubah oleh"}
				filterOperations={filterOperation.string}
			/>

			<Column
				width={100}
				dataField={"modifiedOn"}
				caption={"Tanggal Diubah"}
				dataType={"date"}
				format={"dd MMM yyyy HH:mm:ss"}
				calculateFilterExpression={calculateFilterExpressionCustom}
				filterOperations={filterOperation.date}
			/>
			<Column
				dataField={"name"}
				caption={"Nama"}
				filterOperations={filterOperation.string}
			/>
			<Column
				dataField={"defaultPage"}
				caption={"Default Page"}
				filterOperations={filterOperation.string}
			/>
			<Column
				dataField={"isRoot"}
				caption={"Is Root"}
				filterOperations={filterOperation.boolean}
				cellTemplate={function (container: any, options: any) {
					const dom = ReactDOM.createRoot(container);
					const active = options.data.isRoot ? "true" : "false";
					dom.render(active);
				}}
			/>
			<Column
				dataField={"listAccessName"}
				caption={"Akses"}
				encodeHtml={false}
				cssClass="pre-line"
				filterOperations={filterOperation.string}
			/>
		  <Paging defaultPageSize={50} />
		  <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
		</DataGrid>
	  </div>
	</div>
  </>
}
