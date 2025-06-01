import React, {FC, useRef} from "react";
import DataGrid, {
  Column,
  ColumnChooser,
  FilterRow,
  Item,
  Pager,
  Paging,
  Scrolling,
  Toolbar
} from "devextreme-react/data-grid";
import {useNavigate} from "react-router";
import {Button} from "devextreme-react/button";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../../components/alink";
import {filterOperation} from "../../../constants/FilterOperation";
import {
  calculateFilterExpressionCustom,
  confirmNotify,
  notifyError,
  notifySuccess
} from "../../../utils/devExtremeUtils";
import {disableUser, enableUser, resetPasswordUser} from "../../../api/user.api";
import {listProductStore} from "../../../api/product.api";

export const LoanProductPage: FC = () => {
  const navigate = useNavigate();
  const dataGrid: any = useRef();
  
  return <>
	<h2 className={"content-block"}>Pengaturan Produk Pinjaman</h2>
	<div className={"content-block"}>
	  <div className={"dx-card"}>
		<DataGrid
			ref={dataGrid}
			dataSource={listProductStore}
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
			  {/*<Button*/}
			  {/*  text="Buat Produk Pinjaman"*/}
			  {/*  type="default"*/}
			  {/*  stylingMode="contained"*/}
			  {/*  onClick={()=>navigate("/product/loan/create")}*/}
			  {/*/>*/}
			</Item>
		  </Toolbar>
		  <Scrolling showScrollbar={"onHover"} scrollByContent={true} />
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
						  navigate(`/loan/product/update?id=${options.data.id}`);
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
			  caption={"Nama Produk"}
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
			  caption={"Action"}
			  type={"buttons"}
			  alignment={"center"}
			  buttons={[
				{
				  hint: "Are you want to Copy Product?",
				  icon: "copy",
				  name: "copyProduct",
				  onClick: function (e: any) {
					const key = e.row.data.id;
					confirmNotify(
						`Apakah yakin akan meng-copy produk ini #${e.row.data.seqId} ??`
					).then((result) => {
					  if (result) {
						resetPasswordUser(key)
						.then((rs: any) => {
						  
						  
						  e.component.refresh(true).done(function () {
							e.component.cancelEditData();
						  });
						})
						.catch((e) => notifyError(e.message));
					  }
					});
					
					e.event.preventDefault();
				  }
				},
				{
				  hint: "Are you want to enable Product?",
				  icon: "check",
				  name: "enable",
				  visible: ({component, row, column})=> {
					if(row){
					  return !row.data.isActive;
					}
					return false;
				  },
				  onClick: function (e: any) {
					const key = e.row.data.id;
					confirmNotify(
						`Apakah yakin akan mengaktifkan produk ini #${e.row.data.seqId} ??`
					).then((result) => {
					  if (result) {
						enableUser(key)
						.then((rs: any) => {
						  
						  
						  e.component.refresh(true).done(function () {
							e.component.cancelEditData();
						  });
						})
						.catch((e) => notifyError(e.message));
					  }
					});
					
					e.event.preventDefault();
				  }
				},
				{
				  hint: "Are you want to disable Product?",
				  icon: "close",
				  name: "disable",
				  visible: ({component, row, column})=> {
					if(row){
					  return row.data.isActive;
					}
					return false;
				  },
				  onClick: function (e: any) {
					const key = e.row.data.id;
					confirmNotify(
						`Apakah yakin akan menonaktifkan produk ini #${e.row.data.seqId} ??`
					).then((result) => {
					  if (result) {
						disableUser(key)
						.then((resp: boolean) => {
						  notifySuccess("Product sudah dinon-aktifkan");
						  e.component.refresh(true).done(function () {
							e.component.cancelEditData();
						  });
						})
						.catch((e) => notifyError(e.message));
					  }
					});
					
					e.event.preventDefault();
				  }
				}
			  ]}
			  width={90}
		  ></Column>
		  <Paging defaultPageSize={50} />
		  <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
		</DataGrid>
	  </div>
	</div>
  </>;
}
