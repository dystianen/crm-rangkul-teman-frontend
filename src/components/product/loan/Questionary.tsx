import React, {useState, useRef, useCallback, useEffect} from 'react';
import DataGrid, {Column, FilterRow, Scrolling} from "devextreme-react/data-grid";
import {calculateFilterExpressionCustom} from "../../../utils/devExtremeUtils";
import {filterOperation} from "../../../constants/FilterOperation";
import {listProductQuestionaryStore} from "../../../api/product.questionary.api";

const ProductQuestionary = ({category, productId}: { category: string, productId: string }) => {
  useEffect(() => {
	
  }, [productId]);
  
  return (<>
	<DataGrid
		id={category+"ProductQuestionaryGrid"}
		dataSource={listProductQuestionaryStore(category, productId)}
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
		  dataField={"name"}
		  caption={"Questionary"}
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

export default ProductQuestionary;
