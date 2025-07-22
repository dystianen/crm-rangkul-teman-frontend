import React, {useState, useRef, useCallback, useEffect} from 'react';
import {listProductParameterStore} from "../../../api/product.parameter.api";
import DataGrid, {Column, FilterRow, Scrolling} from "devextreme-react/data-grid";
import {calculateFilterExpressionCustom} from "../../../utils/devExtremeUtils";
import {filterOperation} from "../../../constants/FilterOperation";

const ProductParameter = ({productId}: { productId: string }) => {
  useEffect(() => {
	
  }, [productId]);
  
  return (<>
	<DataGrid
		id={"productParameterGrid"}
		dataSource={listProductParameterStore(productId)}
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
		  dataField={"paramName"}
		  caption={"Param Name"}
		  filterOperations={filterOperation.string}
	  />
	  <Column
		  dataField={"paramValue"}
		  caption={"Param Value"}
		  filterOperations={filterOperation.string}
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

export default ProductParameter;
