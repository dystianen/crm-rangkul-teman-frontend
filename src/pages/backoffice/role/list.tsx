import {listUserStore} from "../../../api/user.api";
import DataGrid, {Column, FilterRow, Item, Pager, Paging, Scrolling, Toolbar} from "devextreme-react/data-grid";
import {Button} from "devextreme-react/button";
import React, {FC, useRef} from "react";
import {useNavigate} from "react-router";
import {listRoleStore} from "../../../api/role.api";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../../components/alink";
import {filterOperation} from "../../../constants/FilterOperation";


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
			editing={{
			  allowDeleting: true
			}}
		>
		  <Toolbar>
			<Item location="after">
			  <Button
				  text="Buat Role"
				  type="success"
				  stylingMode="contained"
				  onClick={() => {
					
				  }}
			  />
			</Item>
			<Item location="after">
			  <Button
				  text="Buat Akses"
				  type="normal"
				  stylingMode="contained"
				  onClick={() => {
					
				  }}
			  />
			</Item>
		  </Toolbar>
		  <Scrolling showScrollbar={"always"}/>
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
						  navigate(`/backoffice/user/update?id=${options.data.id}`);
						}}
					>
					  {options.data.seqId}
					</OnClickLink>
				);
			  }}
			  filterOperations={filterOperation.numeric}
		  />
		  
		  <Paging defaultPageSize={50} />
		  <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
		</DataGrid>
	  </div>
	</div>
  </>
}
