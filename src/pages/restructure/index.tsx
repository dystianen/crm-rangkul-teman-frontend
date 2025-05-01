import React, {FC, useEffect, useRef} from "react";
import {useNavigate} from "react-router";
import DataGrid, {Column, ColumnChooser, FilterRow, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {listStore} from "../../api/payment";
import {filterOperation} from "../../constants/FilterOperation";
import {downloadExcel} from "../../api/http.api";
import * as downloadFile from "save-file";
import {restructureV2ListStore} from "../../api/restructure_v2";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../components/alink";
import {checkAccess} from "../../api/apploan";
import {backofficeAccess} from "../../constants/variableConstata";
import {calculateFilterExpressionCustom} from "../../utils/devExtremeUtils";

export const RestructureListPage: FC = () => {
  const navigate = useNavigate();
  
  const dataGrid: any = useRef();
  
  useEffect(() => {
	checkAccess(backofficeAccess.backoffice_restructure_read).then((res) => {
	  if (!res) {
		navigate("/contract");
	  }
	});
  }, []);
  
  const onClickDownload = (e: any) => {
	let instance = dataGrid.current?.instance;
	let fileName = `restructure.xlsx`;
	let columns: any[] = [];
	let captions: any[] = [];
	const visibleColums = instance.getVisibleColumns();
	visibleColums.filter(function (val: any) {
	  if (val.dataField != null) {
		columns.push(val.dataField);
	  }
	  if (val.caption != null) {
		captions.push(val.caption);
	  }
	});
	
	const filter = instance.getCombinedFilter(true) || [];
	let paramSearch = {
	  columns: JSON.stringify(columns),
	  captions: JSON.stringify(captions),
	  searchQuery: JSON.stringify(filter),
	};
	
	downloadExcel(`/api/trx/contract/restructure/download`, paramSearch)
	.then((response) => {
	  downloadFile(response, fileName);
	})
	.catch(console.error);
	console.log(paramSearch);
  }
  
  const onToolbarPreparing = (e: any) => {
	const items = e.toolbarOptions.items;
	items.unshift({
	  location: 'after',
	  widget: 'dxButton',
	  options: {
		text: "Download",
		type: "success",
		stylingMode: "contained",
		hint: 'Download',
		onClick: onClickDownload,
	  },
	});
  }
  return (<>
	<h2 className={"content-block"}>Restruktur</h2>
	<div className={"content-block"}>
	  <div className={"dx-card"}>
		<DataGrid
			ref={dataGrid}
			dataSource={restructureV2ListStore}
			focusedRowEnabled={true}
			remoteOperations={true}
			columnAutoWidth={true}
			wordWrapEnabled={false}
			showBorders={true}
			dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
			repaintChangesOnly={true}
			onToolbarPreparing={onToolbarPreparing}
		>
		  <ColumnChooser
			  enabled={true}
			  mode={'select'}
		  />
		  <FilterRow visible={true}/>
		  <Column
			  alignment={"center"}
			  dataField={"seqId"}
			  caption={"#NO"}
			  width={90}
			  cellTemplate={function (container: any, options: any) {
				const dom = ReactDOM.createRoot(container);
				dom.render(<OnClickLink
					onClick={() => navigate(`/restructure/detail?id=${options.data.id}`)}>{options.data.seqId}</OnClickLink>);
			  }}
			  filterOperations={filterOperation.numeric}
		  />
		  <Column
			  dataField={"createdOn"}
			  caption={"Tanggal Dibuat"}
			  dataType={"date"}
			  format={"dd MMM yyyy HH:mm:ss"}
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
			  dataField={"categoryName"}
			  caption={"Tipe"}
			  width={190}
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
			  dataField={"statusName"}
			  caption={"Status"}
			  filterOperations={filterOperation.string}
		  />
		  <Column
			  dataField={"frequencyName"}
			  caption={"Frequency"}
			  alignment={"left"}
			  filterOperations={filterOperation.string}
		  />
		  <Column
			  alignment={"center"}
			  dataField={"contractNumber"}
			  caption={"#No.Pinjaman"}
			  cellTemplate={function (container: any, options: any) {
				const dom = ReactDOM.createRoot(container);
				dom.render(<OnClickLink
					onClick={() => navigate(`/contract/detail?id=${options.data.contractId}`)}>{options.data.contractNumber}</OnClickLink>);
			  }}
			  filterOperations={filterOperation.numeric}
		  />
		  <Column
			  dataField={"initialPayment"}
			  caption={"Initial Payment"}
			  filterOperations={filterOperation.numeric}
			  format="Rp #,##0.00"
		  />
		  <Column
			  dataField={"validFrom"}
			  caption={"Berlaku Dari"}
			  dataType={"date"}
			  format={"dd MMM yyyy"}
			  calculateFilterExpression={calculateFilterExpressionCustom}
			  filterOperations={filterOperation.date}
		  />
		  <Column
			  dataField={"validUntil"}
			  caption={"Berlaku Sampai"}
			  dataType={"date"}
			  format={"dd MMM yyyy"}
			  calculateFilterExpression={calculateFilterExpressionCustom}
			  filterOperations={filterOperation.date}
		  />
		  <Column
			  dataField={"branchName"}
			  caption={"Nama Cabang"}
			  filterOperations={filterOperation.string}
		  />
		  
		  <Paging defaultPageSize={50}/>
		  <Pager
			  showPageSizeSelector={true}
			  showInfo={true}
			  allowedPageSizes={[10, 50, 100]}
		  />
		</DataGrid>
	  </div>
	</div>
  </>);
}
