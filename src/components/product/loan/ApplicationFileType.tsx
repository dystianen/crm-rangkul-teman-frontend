import React, {useState, useRef, useCallback, useEffect} from 'react';
import DataGrid, {Column, FilterRow, Scrolling} from "devextreme-react/data-grid";
import {calculateFilterExpressionCustom} from "../../../utils/devExtremeUtils";
import {filterOperation} from "../../../constants/FilterOperation";
import {listProductAppFileTypeStore} from "../../../api/product.application.file.type.api";
import ReactDOM from "react-dom/client";

const ProductApplicationFileType = ({productId}: { productId: string }) => {
  useEffect(() => {
	
  }, [productId]);
  
  return (<>
	<DataGrid
		id={"productApplicationFileTypeGrid"}
		dataSource={listProductAppFileTypeStore(productId)}
		focusedRowEnabled={true}
		remoteOperations={true}
		columnAutoWidth={true}
		wordWrapEnabled={true}
		showBorders={true}
		dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
		repaintChangesOnly={true}
	>
	  <Scrolling showScrollbar={"always"}/>
	  <FilterRow visible={true}/>
	  <Column
		  dataField={"fileTypeName"}
		  caption={"Name"}
		  filterOperations={filterOperation.string}
	  />
	  <Column
		  dataField={"isRequired"}
		  caption={"Required"}
		  filterOperations={filterOperation.boolean}
		  cellTemplate={function (container: any, options: any) {
			const dom = ReactDOM.createRoot(container);
			const active = options.data.isRequired ? "true" : "false";
			dom.render(active);
		  }}
	  />
	  <Column
		  dataField={"createdByName"}
		  caption={"Dibuat oleh"}
		  filterOperations={filterOperation.string}
		  visible={false}
	  />
	  <Column
		  dataField={"createdOn"}
		  caption={"Tanggal Dibuat"}
		  dataType={"date"}
		  format={"dd MMM yyyy HH:mm:ss"}
		  calculateFilterExpression={calculateFilterExpressionCustom}
		  filterOperations={filterOperation.date}
		  visible={false}
	  />
	  <Column
		  dataField={"modifiedByName"}
		  caption={"Diubah oleh"}
		  filterOperations={filterOperation.string}
	  />
	  <Column
		  dataField={"modifiedOn"}
		  caption={"Tanggal Diubah"}
		  dataType={"date"}
		  format={"dd MMM yyyy HH:mm:ss"}
		  calculateFilterExpression={calculateFilterExpressionCustom}
		  filterOperations={filterOperation.date}
	  />
	</DataGrid>
  </>);
}

export default ProductApplicationFileType;
