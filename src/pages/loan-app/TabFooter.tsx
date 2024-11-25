import React, {FC} from "react";
import Form, {Tab, TabbedItem, TabPanelOptions} from "devextreme-react/form";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {ApprovalHistory} from "../approval1-app/ApprovalHistory";
import {ApplicationFiles} from "../approval1-app/ApplicationFiles";

export const TabFooter: FC = () => {
    const location = useLocation();
    const {id} = queryString.parse(location.search);

    return <>
        <div className={"dx-card responsive-paddings next-card"}>
            <div className="form__tabs">
                <Form>
                    <TabbedItem
                        tabPanelOptions={{
                            scrollByContent: true,
                            showNavButtons: true,
                        }}
                    >
                        <TabPanelOptions deferRendering={false}/>
                        <Tab title="Histori Persetujuan"><ApprovalHistory id={id}/></Tab>
                        <Tab title="Dokumen"><ApplicationFiles id={id}/></Tab>
                    </TabbedItem>
                </Form>
            </div>
        </div>
    </>
}