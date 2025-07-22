import Form, {Tab, TabbedItem, TabPanelOptions} from "devextreme-react/form";
import React from "react";

export const TabFooter = ({productId}: { productId: string }) => {
  
  return (<>
	<div className={"dx-card responsive-paddings next-card"}>
	  <div className="form__tabs">
		<Form>
		  <TabbedItem
			  tabPanelOptions={{
				scrollByContent: true,
				showNavButtons: true
			  }}
		  >
			<TabPanelOptions deferRendering={false}/>
			<Tab title="Product Parameters">
			</Tab>
			<Tab title="Product Term">
			</Tab>
			<Tab title="Product By Branch">
			</Tab>
			<Tab title="LPF By Product">
			</Tab>
			<Tab title="Application File Type">
			</Tab>
			<Tab title="Questionary Selling">
			</Tab>
			<Tab title="Questionary Neigbour">
			</Tab>
		  </TabbedItem>
		</Form>
	  </div>
	</div>
  </>);
};
